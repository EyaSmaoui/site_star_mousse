const Manager = require('../models/manager.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;

exports.addManager = async (req, res) => {
  try {
    const { name, email, phone, password, role, status } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newManager = new Manager({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "gestionnaire",
      status: status || "actif"
    });

    const savedManager = await newManager.save();
    console.log("✅ Gestionnaire enregistré ! ID:", savedManager._id);
    res.status(201).json({ ...savedManager.toObject(), password: undefined });
  } catch (error) {
    console.error("❌ Erreur lors de l'enregistrement :", error.message);
    res.status(500).json({ message: "Échec de validation", error: error.message });
  }
};

exports.getAllManagers = async (req, res) => {
  try {
    const managers = await Manager.find().select('-password').sort({ createdAt: -1 });
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

// Login pour les gestionnaires
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: "L'email est requis." });
    }
    if (!password) {
      return res.status(400).json({ error: "Le mot de passe est requis." });
    }

    const manager = await Manager.findOne({ email: email.trim().toLowerCase() });
    if (!manager) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    const passwordMatch = await bcrypt.compare(password, manager.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    if (manager.status !== "actif") {
      return res.status(403).json({ error: "Compte inactif. Contactez l'administrateur." });
    }

    const token = jwt.sign(
      { managerId: manager._id, email: manager.email, role: manager.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: "Connexion réussie",
      user: {
        id: manager._id,
        name: manager.name,
        email: manager.email,
        phone: manager.phone,
        role: manager.role,
        status: manager.status
      },
      token
    });
  } catch (error) {
    console.error("❌ Erreur login gestionnaire:", error.message);
    res.status(500).json({ error: error.message });
  }
};