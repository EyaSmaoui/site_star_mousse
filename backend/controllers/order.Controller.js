const Order = require('../models/order.model');
const User = require('../models/user.model');
const Client = require('../models/client.model');

const formatTotal = (value) => `${Number(value || 0).toLocaleString('fr-TN')} DT`;

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
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

exports.addOrder = async (req, res) => {
  try {
    const products = Array.isArray(req.body.products)
      ? req.body.products
          .filter((product) => product && product.name)
          .map((product) => ({
            name: String(product.name || "Produit Star Mousse"),
            quantity: Math.max(1, Number(product.quantity || 1)),
            price: Number(product.price || 0),
          }))
      : [];
    const computedTotal = products.reduce(
      (sum, product) => sum + Number(product.price || 0) * Number(product.quantity || 1),
      0
    );
    const total = Number.isFinite(Number(req.body.total)) ? Number(req.body.total) : computedTotal;
    const phone = String(req.body.phone || "").trim();
    const address = String(req.body.address || "").trim();

    if (!phone || !address || !products.length || !Number.isFinite(total)) {
      return res.status(400).json({
        message: "Informations de commande incompletes",
        error: "Telephone, adresse, produit et total sont obligatoires.",
      });
    }

    const customerName = String(req.body.customerName || req.body.name || req.user?.username || "Client").trim() || "Client";
    const customerEmail = String(req.body.customerEmail || req.body.email || req.user?.email || "client@starmousse.tn").trim().toLowerCase() || "client@starmousse.tn";

    // If the request is not authenticated but contains email+password, try to authenticate the user
    let effectiveUserId = req.user ? req.user._id : null;
    if (!effectiveUserId && req.body.email && req.body.password) {
      try {
        const authUser = await User.Login(String(req.body.email).trim().toLowerCase(), String(req.body.password));
        effectiveUserId = authUser._id;

        // Attach any previous orders made with this email to the authenticated user
        await Order.updateMany(
          { customerEmail: authUser.email, $or: [{ userId: null }, { userId: { $exists: false } }] },
          { $set: { userId: authUser._id } }
        );

        // Update basic contact info on the user
        await User.findByIdAndUpdate(authUser._id, { $set: { phone: phone || authUser.phone, address: address || authUser.address } });
      } catch (e) {
        // If password is incorrect, return an error so the client can ask for correct credentials
        if (e?.message?.includes('Mot de passe incorrect')) {
          return res.status(401).json({ message: 'Mot de passe incorrect pour cet email.' });
        }
        // If user not found, continue as guest (do not create duplicate accounts here)
      }
    }

    const newOrder = new Order({
      userId: effectiveUserId,
      customerName,
      customerEmail,
      phone,
      address,
      products,
      total,
      status: req.body.status || "en attente"
    });

    const savedOrder = await newOrder.save();

    if (effectiveUserId) {
      await User.findByIdAndUpdate(effectiveUserId, {
        $set: { phone, address },
      });
    }

    await syncClientRecord({ email: customerEmail, name: customerName, phone });
    console.log("✅ Commande enregistrée ! ID:", savedOrder._id);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ Erreur lors de l'enregistrement :", error.message);
    const status = error?.name === "ValidationError" || error?.name === "CastError" ? 400 : 500;
    res.status(status).json({ message: "Echec enregistrement commande", error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  const startedAt = Date.now();
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 300);
    const orders = await Order.find()
      .select('customerName customerEmail phone address products total status createdAt updatedAt')
      .sort({ _id: -1 })
      .limit(limit)
      .maxTimeMS(8000)
      .lean();
    if (Date.now() - startedAt > 1000) {
      console.warn(`[orders] Liste lente: ${Date.now() - startedAt}ms limit=${limit}`);
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Erreur récupération :", error.message);
    res.status(500).json({ message: "Erreur récupération", error: error.message });
  }
};

exports.getOrdersPing = async (req, res) => {
  try {
    const count = await Order.estimatedDocumentCount().maxTimeMS(3000);
    res.status(200).json({ ok: true, count });
  } catch (error) {
    console.error("❌ Erreur diagnostic commandes :", error.message);
    res.status(503).json({ ok: false, message: "Base commandes lente ou indisponible", error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500);
    const orders = await Order.find({ userId: userId })
      .select('customerName customerEmail phone address products total status createdAt updatedAt')
      .sort({ _id: -1 })
      .limit(limit)
      .maxTimeMS(8000)
      .lean();
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Erreur récupération des commandes :", error.message);
    res.status(500).json({ message: "Erreur récupération", error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    console.log("✅ Commande mise à jour ! ID:", updatedOrder._id);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour :", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    console.log("✅ Commande supprimée ! ID:", id);
    res.status(200).json({ message: "Commande supprimée avec succès" });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression :", error.message);
    res.status(500).json({ message: error.message });
  }
};
