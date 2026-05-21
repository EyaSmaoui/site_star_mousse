const Client = require('../models/client.model');

exports.addClient = async (req, res) => {
  try {
    const newClient = new Client({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      orders: req.body.orders || 0,
      total: req.body.total || "0 DT",
      status: req.body.status || "actif"
    });

    const savedClient = await newClient.save();
    console.log("✅ Client enregistré ! ID:", savedClient._id);
    res.status(201).json(savedClient);
  } catch (error) {
    console.error("❌ Erreur lors de l'enregistrement :", error.message);
    res.status(500).json({ message: "Échec de validation", error: error.message });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.status(200).json(clients);
  } catch (error) {
    console.error("❌ Erreur récupération :", error.message);
    res.status(500).json({ message: "Erreur récupération", error: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedClient = await Client.findByIdAndUpdate(id, { ...req.body, updatedAt: Date.now() }, { new: true });
    if (!updatedClient) {
      return res.status(404).json({ message: "Client non trouvé" });
    }
    console.log("✅ Client mis à jour ! ID:", updatedClient._id);
    res.status(200).json(updatedClient);
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour :", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClient = await Client.findByIdAndDelete(id);
    if (!deletedClient) {
      return res.status(404).json({ message: "Client non trouvé" });
    }
    console.log("✅ Client supprimé ! ID:", id);
    res.status(200).json({ message: "Client supprimé avec succès" });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression :", error.message);
    res.status(500).json({ message: error.message });
  }
};