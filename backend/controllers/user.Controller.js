const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY || 'your-secret-key';

// Ajouter un utilisateur (Inscription)
exports.addUser = async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;

        // Validations supplémentaires
        if (!username || !username.trim()) {
            return res.status(400).json({ error: "Le nom d'utilisateur est requis." });
        }
        if (!email || !email.trim()) {
            return res.status(400).json({ error: "L'email est requis." });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères." });
        }
        if (!phone || !phone.trim()) {
            return res.status(400).json({ error: "Le numéro de téléphone est requis." });
        }

        const newUser = new User({
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password,
            phone: phone.trim(),
            role: 'client' // Sécurité : inscription publique crée toujours un client
        });
        await newUser.save();
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: "Utilisateur cree avec succes",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role
            },
            token
        });
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        if (error.code === 11000) { // Duplicate key
            res.status(400).json({ error: "Cet email est déjà utilisé." });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
};

exports.createEmployerByAdmin = async (req, res) => {
    try {
        const { username, email, password, phone, role } = req.body;

        if (!username || !username.trim()) {
            return res.status(400).json({ error: "Le nom d'utilisateur est requis." });
        }
        if (!email || !email.trim()) {
            return res.status(400).json({ error: "L'email est requis." });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères." });
        }
        if (!phone || !phone.trim()) {
            return res.status(400).json({ error: "Le numéro de téléphone est requis." });
        }

        const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: "Cet email est déjà utilisé." });
        }

        const allowedRoles = ['manager', 'employee', 'employeur'];
        const forcedRole = allowedRoles.includes(role) ? role : 'manager';

        const newEmployer = new User({
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password,
            phone: phone.trim(),
            role: forcedRole
        });
        await newEmployer.save();

        res.status(201).json({ message: "Compte employeur créé avec succès", user: { id: newEmployer._id, username: newEmployer.username, email: newEmployer.email, role: newEmployer.role } });
    } catch (error) {
        console.error("Erreur lors de la création d'employeur :", error);
        if (error.code === 11000) {
            return res.status(400).json({ error: "Cet email est déjà utilisé." });
        }
        res.status(500).json({ error: error.message });
    }
};

// Connexion
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({ error: "L'email est requis." });
        }
        if (!password) {
            return res.status(400).json({ error: "Le mot de passe est requis." });
        }

        const user = await User.Login(email.trim().toLowerCase(), password);

        // Générer un token JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Connexion réussie",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // On cache les mots de passe
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer tous les utilisateurs avec mot de passe (hashé) - uniquement pour test
exports.getAllUsersWithPassword = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Utilisateur supprimé" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Logout (Simple côté serveur si pas de JWT complexe)
exports.logout = (req, res) => {
    res.status(200).json({ message: "Déconnexion réussie" });
};

// Récupérer le profil de l'utilisateur connecté
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            address: user.address || '',
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour le profil de l'utilisateur connecté
exports.updateProfile = async (req, res) => {
    try {
        const { username, phone, address } = req.body;
        
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Mise à jour des champs
        if (username && username.trim()) user.username = username.trim();
        if (phone && phone.trim()) user.phone = phone.trim();
        if (address !== undefined && address.trim()) user.address = address.trim();

        await user.save();

        res.status(200).json({
            message: 'Profil mis à jour avec succès',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                address: user.address || '',
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUserByAdmin = async (req, res) => {
    try {
        const { username, email, password, phone, role } = req.body;
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        if (username && username.trim()) user.username = username.trim();
        if (email && email.trim()) user.email = email.trim().toLowerCase();
        if (phone && phone.trim()) user.phone = phone.trim();
        if (role) user.role = role;
        if (password && password.length >= 6) user.password = password;

        await user.save();

        res.status(200).json({
            message: 'Utilisateur mis à jour avec succès',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Erreur updateUserByAdmin :', error.message);
        res.status(500).json({ error: error.message });
    }
};
