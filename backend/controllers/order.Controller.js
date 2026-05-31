const Order = require('../models/order.model');

exports.addOrder = async (req, res) => {
  try {
    const newOrder = new Order({
      userId: req.user ? req.user._id : null,
      customerName: req.body.customerName || "Client",
      customerEmail: req.body.customerEmail || "client@starmousse.tn",
      phone: req.body.phone,
      address: req.body.address,
      products: req.body.products,
      total: req.body.total,
      status: req.body.status || "en attente"
    });

    const savedOrder = await newOrder.save();
    console.log("✅ Commande enregistrée ! ID:", savedOrder._id);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ Erreur lors de l'enregistrement :", error.message);
    res.status(500).json({ message: "Échec de validation", error: error.message });
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
