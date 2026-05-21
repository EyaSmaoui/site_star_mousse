const Manager = require('../models/manager.model');

exports.addManager = async (req, res) => {
  try {
    const newManager = new Manager({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      status: req.body.status || "actif"
    });

    const savedManager = await newManager.save();
    console.log("✅ Gestionnaire enregistré ! ID:", savedManager._id);
    res.status(201).json(savedManager);
  } catch (error) {
    console.error("❌ Erreur lors de l'enregistrement :", error.message);
    res.status(500).json({ message: "Échec de validation", error: error.message });
  }
};

exports.getAllManagers = async (req, res) => {
  try {
    const managers = await Manager.find().sort({ createdAt: -1 });
    res.status(200).json(managers);
  } catch (error) {
    console.error("❌ Erreur récupération :", error.message);
    res.status(500).json({ message: "Erreur récupération", error: error.message });
  }
};

exports.updateManager = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedManager = await Manager.findByIdAndUpdate(id, { ...req.body, updatedAt: Date.now() }, { new: true });
    if (!updatedManager) {
      return res.status(404).json({ message: "Gestionnaire non trouvé" });
    }
    console.log("✅ Gestionnaire mis à jour ! ID:", updatedManager._id);
    res.status(200).json(updatedManager);
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour :", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteManager = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedManager = await Manager.findByIdAndDelete(id);
    if (!deletedManager) {
      return res.status(404).json({ message: "Gestionnaire non trouvé" });
    }
    console.log("✅ Gestionnaire supprimé ! ID:", id);
    res.status(200).json({ message: "Gestionnaire supprimé avec succès" });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression :", error.message);
    res.status(500).json({ message: error.message });
  }
};