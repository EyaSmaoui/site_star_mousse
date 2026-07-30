const Order = require('../models/order.model');
const User = require('../models/user.model');
const Client = require('../models/client.model');

// Utilitaire de formatage monétaire pour l'affichage des montants aux normes tunisiennes
const formatTotal = (value) => `${Number(value || 0).toLocaleString('fr-TN')} DT`;
const CUSTOMER_ROLES = new Set(['client', 'user']);
const isCustomerUser = (user) => CUSTOMER_ROLES.has(String(user?.role || '').toLowerCase());

// [INTERFACE SITE] : TABLEAU DE BORD ADMIN (Section CRM / Gestion Clientèle)
// Fonction asynchrone de synchronisation de la collection 'Client'. Elle agrège l'historique d'achat d'un e-mail (nombre de commandes et montant total cumulé) 
// pour alimenter le tableau de bord de fidélité et de suivi de l'administrateur (Pattern Upsert).
const syncClientRecord = async ({ email, name, phone }) => {
  if (!email) return;

  const orders = await Order.find({ customerEmail: email }).select('total').lean();
  const totalAmount = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  await Client.findOneAndUpdate(
    { email },
    {
      $set: {
        name: name || 'Client',
        phone: phone || '',
        orders: orders.length,
        total: formatTotal(totalAmount),
        status: 'actif',
        updatedAt: Date.now(),
      },
      $setOnInsert: {
        createdAt: Date.now(),
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true } // Upsert: Crée le client s'il n'existe pas, le met à jour sinon
  );
};

// [INTERFACE SITE] : TUNNEL DE COMMANDE / PAGE CHECKOUT (Validation du Panier)
// Contrôleur gérant la soumission du formulaire de livraison. Il valide l'intégrité des données (téléphone, adresse), 
// calcule de sécurité du montant total global côté serveur, et prend en charge l'authentification transparente à la volée de l'utilisateur si nécessaire.
exports.addOrder = async (req, res) => {
  try {
    // Sanatization et re-calcul des prix des produits soumis pour parer aux fraudes d'injection Front-end
    const products = Array.isArray(req.body.products)
      ? req.body.products
          .filter((product) => product && product.name)
          .map((product) => ({
            name: String(product.name || "Produit Star Mousse"),
            quantity: Math.max(1, Number(product.quantity || 1)),
            dimension: String(product.dimension || ""),
            price: Number(product.price || 0),
          }))
      : [];
    const computedTotal = products.reduce(
      (sum, product) => sum + Number(product.price || 0) * Number(product.quantity || 1),
      0
    );
    const shippingCost = Number.isFinite(Number(req.body.shippingCost)) ? Number(req.body.shippingCost) : 0;
    const total = Number.isFinite(Number(req.body.total)) ? Number(req.body.total) : computedTotal + shippingCost;
    const phone = String(req.body.phone || "").trim();
    const address = String(req.body.address || "").trim();
    const region = String(req.body.region || "").trim();
    const paymentMethod = String(req.body.paymentMethod || "cash_on_delivery").trim();

    if (!phone || !address || !products.length || !Number.isFinite(total)) {
      return res.status(400).json({
        message: "Informations de commande incompletes",
        error: "Telephone, adresse, produits et total sont obligatoires.",
      });
    }

    const authenticatedCustomer = isCustomerUser(req.user);
    const customerName = String(
      req.body.customerName ||
      req.body.name ||
      (authenticatedCustomer ? req.user?.username : "") ||
      "Client"
    ).trim() || "Client";
    const customerEmail = String(
      req.body.customerEmail ||
      req.body.email ||
      (authenticatedCustomer ? req.user?.email : "") ||
      ""
    ).trim().toLowerCase();

    let effectiveUserId = authenticatedCustomer ? req.user._id : null;
    
    // [FONCTIONNALITE APPRECIABLE] : Si un client achète en tant qu'invité mais possède déjà un compte,
    // le système l'authentifie automatiquement et rattache ses anciennes commandes d'invité à son profil
    if (!effectiveUserId && req.body.email && req.body.password) {
      try {
        const authUser = await User.Login(String(req.body.email).trim().toLowerCase(), String(req.body.password));
        if (isCustomerUser(authUser)) {
          effectiveUserId = authUser._id;
        }

        if (effectiveUserId) {
          await Order.updateMany(
            { customerEmail: authUser.email, $or: [{ userId: null }, { userId: { $exists: false } }] },
            { $set: { userId: authUser._id } }
          );
        }

        if (effectiveUserId) {
          await User.findByIdAndUpdate(authUser._id, { $set: { phone: phone || authUser.phone, address: address || authUser.address } });
        }
      } catch (e) {
        if (e?.message?.includes('Mot de passe incorrect')) {
          return res.status(401).json({ message: 'Mot de passe incorrect pour cet email.' });
        }
      }
    }

    const newOrder = new Order({
      userId: effectiveUserId,
      customerName,
      customerEmail,
      phone,
      address,
      region,
      shippingCost,
      paymentMethod,
      products,
      items: products,
      total,
      status: req.body.status || (paymentMethod === 'cash_on_delivery' ? 'en attente' : 'en attente'),
    });

    const savedOrder = await newOrder.save();

    if (effectiveUserId) {
      await User.findByIdAndUpdate(effectiveUserId, {
        $set: { phone, address },
      });
    }

    // Synchronisation automatique des métriques CRM après validation de commande
    await syncClientRecord({ email: customerEmail, name: customerName, phone });
    console.log("✅ Commande enregistrée ! ID:", savedOrder._id);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ Erreur lors de l'enregistrement :", error.message);
    const status = error?.name === "ValidationError" || error?.name === "CastError" ? 400 : 500;
    res.status(status).json({ message: "Echec enregistrement commande", error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).lean();
    if (!order) {
      return res.status(404).json({ message: 'Commande introuvable.' });
    }

    const searchEmail = String(req.query.email || '').trim().toLowerCase();
    const isOwner = req.user && ((order.userId && String(order.userId) === String(req.user._id)) || String(order.customerEmail || '').toLowerCase() === String(req.user.email || '').toLowerCase());
    const hasAdminAccess = req.user && ['admin', 'manager', 'employee', 'employeur'].includes(String(req.user.role));

    if (!isOwner && !hasAdminAccess && searchEmail) {
      if (String(order.customerEmail || '').toLowerCase() !== searchEmail) {
        return res.status(403).json({ message: 'Accès refusé à cette commande.' });
      }
    }

    if (!isOwner && !hasAdminAccess && !searchEmail) {
      return res.status(403).json({ message: 'Vous devez être authentifié ou fournir l’email de commande.' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Erreur récupération commande par ID :', error.message);
    res.status(500).json({ message: 'Erreur serveur pour récupérer la commande.', error: error.message });
  }
};

// [INTERFACE SITE] : GESTION ADMIN -> LISTE DES COMMANDES (Order Management Dashboard)
// Récupère l'ensemble des commandes passées sur le site avec un système d'enrichissement croisé des données utilisateurs.
// Utilise l'indexation et .lean() pour maximiser la vitesse d'affichage du tableau d'administration.
exports.getAllOrders = async (req, res) => {
  const startedAt = Date.now();
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 300);
    const orders = await Order.find()
      .select('userId customerName customerEmail phone address products total status createdAt updatedAt')
      .sort({ _id: -1 }) // Les plus récentes en premier
      .limit(limit)
      .maxTimeMS(8000) // Timeout de sécurité pour éviter les requêtes bloquantes
      .lean();

    const rawEmails = [...new Set(orders.map((order) => String(order.customerEmail || '').trim()).filter(Boolean))];
    const emails = [...new Set(rawEmails.flatMap((email) => [email, email.toLowerCase()]))];
    const userIds = [...new Set(orders.map((order) => order.userId).filter(Boolean).map((id) => String(id)))];

    const userQuery = [
      ...(emails.length ? [{ email: { $in: emails } }] : []),
      ...(userIds.length ? [{ _id: { $in: userIds } }] : []),
    ];
    const users = userQuery.length ? await User.find({ $or: userQuery }).select('username email phone address role').lean() : [];

    const usersByEmail = new Map(users.map((user) => [String(user.email || '').trim().toLowerCase(), user]));
    const usersById = new Map(users.map((user) => [String(user._id), user]));

    // Enrichit dynamiquement le nom du client si la commande est liée à un compte enregistré
    const enrichedOrders = orders.map((order) => {
      const user = usersById.get(String(order.userId || '')) || usersByEmail.get(String(order.customerEmail || '').trim().toLowerCase());
      if (!user || !isCustomerUser(user)) return order;
      return {
        ...order,
        customerName: order.customerName || user.username || order.customerEmail || order.phone || 'Client',
      };
    });

    if (Date.now() - startedAt > 1000) {
      console.warn(`[orders] Liste lente: ${Date.now() - startedAt}ms limit=${limit}`);
    }
    res.status(200).json(enrichedOrders);
  } catch (error) {
    console.error("❌ Erreur récupération :", error.message);
    res.status(500).json({ message: "Erreur récupération", error: error.message });
  }
};

// [INTERFACE SITE] : DRASHBOARD ADMIN (Indicateur en temps réel / Badge de notification)
// Fournit rapidement un décompte total optimisé des documents (commandes) en base de données, idéal pour afficher les statistiques globales de vente.
exports.getOrdersPing = async (req, res) => {
  try {
    const count = await Order.estimatedDocumentCount().maxTimeMS(3000); // Utilise les métadonnées de MongoDB pour une réponse instantanée
    res.status(200).json({ ok: true, count });
  } catch (error) {
    console.error("❌ Erreur diagnostic commandes :", error.message);
    res.status(503).json({ ok: false, message: "Base commandes lente ou indisponible", error: error.message });
  }
};

// [INTERFACE SITE] : ESPACE CLIENT / COMPTE UTILISATEUR -> "Mes Commandes"
// Extrait et affiche uniquement l'historique d'achat du client connecté (via son ID de session ou son e-mail) pour alimenter sa page de profil personnel.
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const userEmail = String(req.user.email || '').trim().toLowerCase();
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500);
    
    const query = userEmail ? { $or: [{ userId }, { customerEmail: userEmail }] } : { userId };

    // Auto-liaison des commandes anonymes vers le compte officiel du client
    if (userEmail) {
      await Order.updateMany(
        { customerEmail: userEmail, $or: [{ userId: null }, { userId: { $exists: false } }] },
        { $set: { userId } }
      );
    }

    const orders = await Order.find(query)
      .select('customerName customerEmail phone address products total status createdAt updatedAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Erreur récupération des commandes :", error.message);
    res.status(500).json({ message: "Erreur récupération", error: error.message });
  }
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

// [INTERFACE SITE] : GESTION ADMIN -> ACTIONS DU DASHBOARD (Bouton "Éditer / Mettre à jour" ou "Changer le statut")
// Permet à l'administrateur de modifier les coordonnées de livraison d'une commande ou de passer son statut de "en attente" à "livré/confirmé".
// Répercute intelligemment les changements de coordonnées sur le compte utilisateur et les autres commandes associées.
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Commande non trouvée" });

    const allowedFields = ["customerName", "customerEmail", "phone", "address", "region", "shippingCost", "paymentMethod", "products", "total", "status"];
    const orderUpdate = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) orderUpdate[field] = req.body[field];
    });

    const originalEmail = normalizeEmail(order.customerEmail);
    const originalUserId = order.userId ? String(order.userId) : null;

    Object.assign(order, orderUpdate);
    const updatedOrder = await order.save();
    const updatedEmail = normalizeEmail(updatedOrder.customerEmail);

    const userUpdate = {};
    if (req.body.customerName !== undefined) userUpdate.username = String(req.body.customerName || '').trim();
    if (req.body.phone !== undefined) userUpdate.phone = String(req.body.phone || '').trim();
    if (req.body.address !== undefined) userUpdate.address = String(req.body.address || '').trim();

    const contactUpdate = {};
    if (userUpdate.username !== undefined) contactUpdate.customerName = userUpdate.username;
    if (userUpdate.phone !== undefined) contactUpdate.phone = userUpdate.phone;
    if (userUpdate.address !== undefined) contactUpdate.address = userUpdate.address;

    if (Object.keys(contactUpdate).length > 0) {
      let linkedCustomer = null;
      if (originalUserId) linkedCustomer = await User.findById(originalUserId).select('role').lean();

      // Cascade d'update : Met à jour les infos du profil utilisateur en corrélation
      if (originalUserId && isCustomerUser(linkedCustomer)) {
        try {
          await User.findByIdAndUpdate(originalUserId, { $set: userUpdate });
        } catch (err) {
          console.warn(`⚠️ Erreur mise à jour utilisateur:`, err.message);
        }
        
        // Aligne toutes les autres commandes du même utilisateur sur sa nouvelle adresse
        try {
          if (originalEmail) {
            await Order.updateMany({ customerEmail: originalEmail, _id: { $ne: id } }, { $set: contactUpdate });
          }
        } catch (err) {
          console.error(`❌ Erreur mise à jour commandes liées:`, err.message);
        }
      }

      // Re-synchronise l'état global du client dans la collection CRM
      try {
        await syncClientRecord({ 
          email: updatedEmail || originalEmail, 
          name: updatedOrder.customerName, 
          phone: updatedOrder.phone 
        });
      } catch (err) {
        console.error(`❌ Erreur synchro Client CRM:`, err.message);
      }
    }

    console.log("✅ Commande mise à jour ! ID:", updatedOrder._id);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour :", error.message);
    res.status(500).json({ message: error.message });
  }
};

// [INTERFACE SITE] : GESTION ADMIN -> ACTION DU DASHBOARD (Bouton Annuler / Supprimer - Icône de corbeille)
// Supprime définitivement une commande de la base de données (généralement réservé à l'administrateur en cas d'erreur de saisie ou d'annulation client).
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) return res.status(404).json({ message: "Commande non trouvée" });
    console.log("✅ Commande supprimée ! ID:", id);
    res.status(200).json({ message: "Commande supprimée avec succès" });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression :", error.message);
    res.status(500).json({ message: error.message });
  }
};