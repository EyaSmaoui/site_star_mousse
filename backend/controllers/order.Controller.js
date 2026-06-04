const Order = require('../models/order.model');
const User = require('../models/user.model');
const Client = require('../models/client.model');

const formatTotal = (value) => `${Number(value || 0).toLocaleString('fr-TN')} DT`;
const CUSTOMER_ROLES = new Set(['client', 'user']);
const isCustomerUser = (user) => CUSTOMER_ROLES.has(String(user?.role || '').toLowerCase());

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
            dimension: String(product.dimension || ""),
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

    // If the request is not authenticated but contains email+password, try to authenticate the user
    let effectiveUserId = authenticatedCustomer ? req.user._id : null;
    if (!effectiveUserId && req.body.email && req.body.password) {
      try {
        const authUser = await User.Login(String(req.body.email).trim().toLowerCase(), String(req.body.password));
        if (isCustomerUser(authUser)) {
          effectiveUserId = authUser._id;
        }

        // Attach any previous orders made with this email to the authenticated user
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
      .select('userId customerName customerEmail phone address products total status createdAt updatedAt')
      .sort({ _id: -1 })
      .limit(limit)
      .maxTimeMS(8000)
      .lean();

    const rawEmails = [
      ...new Set(
        orders
          .map((order) => String(order.customerEmail || '').trim())
          .filter(Boolean)
      ),
    ];
    const emails = [
      ...new Set(
        rawEmails.flatMap((email) => [email, email.toLowerCase()])
      ),
    ];
    const userIds = [
      ...new Set(
        orders
          .map((order) => order.userId)
          .filter(Boolean)
          .map((id) => String(id))
      ),
    ];

    const userQuery = [
      ...(emails.length ? [{ email: { $in: emails } }] : []),
      ...(userIds.length ? [{ _id: { $in: userIds } }] : []),
    ];
    const users = userQuery.length
      ? await User.find({ $or: userQuery })
          .select('username email phone address role')
          .lean()
      : [];

    const usersByEmail = new Map(
      users.map((user) => [String(user.email || '').trim().toLowerCase(), user])
    );
    const usersById = new Map(users.map((user) => [String(user._id), user]));

    const enrichedOrders = orders.map((order) => {
      const user =
        usersById.get(String(order.userId || '')) ||
        usersByEmail.get(String(order.customerEmail || '').trim().toLowerCase());

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
    const userEmail = String(req.user.email || '').trim().toLowerCase();
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500);
    
    console.log(`[GET MY ORDERS] 👤 userId: ${userId}, 📧 email: ${userEmail}`);

    const query = userEmail
      ? { $or: [{ userId }, { customerEmail: userEmail }] }
      : { userId };

    if (userEmail) {
      const linkResult = await Order.updateMany(
        { customerEmail: userEmail, $or: [{ userId: null }, { userId: { $exists: false } }] },
        { $set: { userId } }
      );
      console.log(`[GET MY ORDERS] 🔗 Lien userId pour ${linkResult.modifiedCount} commandes sans userId`);
    }

    const orders = await Order.find(query)
      .select('customerName customerEmail phone address products total status createdAt updatedAt')
      .sort({ createdAt: -1 })  // Tri par date de création (plus récent en premier)
      .limit(limit)
      .maxTimeMS(8000)
      .lean();
    
    console.log(`[GET MY ORDERS] ✅ Retour: ${orders.length} commandes pour l'utilisateur`);
    if (orders.length > 0) {
      console.log(`[GET MY ORDERS] 📊 Première commande:`, {
        id: orders[0]._id,
        customerName: orders[0].customerName,
        phone: orders[0].phone,
        address: orders[0].address,
        status: orders[0].status
      });
    }
    
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Erreur récupération des commandes :", error.message);
    res.status(500).json({ message: "Erreur récupération", error: error.message });
  }
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    const allowedFields = ["customerName", "customerEmail", "phone", "address", "products", "total", "status"];
    const orderUpdate = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        orderUpdate[field] = req.body[field];
      }
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

    // Only update other orders if contact info changed AND we have identifying info
    if (Object.keys(contactUpdate).length > 0) {
      let linkedCustomer = null;
      if (originalUserId) {
        linkedCustomer = await User.findById(originalUserId).select('role').lean();
      }

      if (originalUserId && isCustomerUser(linkedCustomer)) {
        try {
          await User.findByIdAndUpdate(originalUserId, { $set: userUpdate });
        } catch (err) {
          console.warn(`⚠️  Couldn't update user ${originalUserId}:`, err.message);
        }
        
        try {
          // Only update orders with the SAME original email (not by userId to avoid merging different customers)
          if (originalEmail) {
            const result = await Order.updateMany(
              { customerEmail: originalEmail, _id: { $ne: id } },
              { $set: contactUpdate }
            );
            console.log(`✅ Updated ${result.modifiedCount} related orders for email ${originalEmail}`);
          }
        } catch (err) {
          console.error(`❌ Error updating related orders for ${originalEmail}:`, err.message);
        }
      } else if (updatedEmail && updatedEmail !== originalEmail) {
        // If email changed and no userId, try to link with existing user
        try {
          const linkedUser = await User.findOne({ email: updatedEmail, role: { $in: [...CUSTOMER_ROLES] } });
          if (linkedUser) {
            await User.findByIdAndUpdate(linkedUser._id, { $set: userUpdate });
            // Link all old-email orders to this user
            if (originalEmail) {
              await Order.updateMany(
                { customerEmail: originalEmail },
                { $set: { userId: linkedUser._id, ...contactUpdate } }
              );
            }
          }
        } catch (err) {
          console.warn(`⚠️  Email linking failed:`, err.message);
        }
      }

      // Always sync the client record after contact update
      try {
        await syncClientRecord({ 
          email: updatedEmail || originalEmail, 
          name: updatedOrder.customerName, 
          phone: updatedOrder.phone 
        });
      } catch (err) {
        console.error(`❌ Error syncing client record:`, err.message);
      }
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
