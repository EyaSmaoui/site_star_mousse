const User = require('../models/user.model');
const Order = require('../models/order.model');
const Client = require('../models/client.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;

// ==========================================
// FONCTIONS UTILITAIRES Centralisées
// ==========================================

const getResetTokenHash = (token) => 
    crypto.createHash('sha256').update(token).digest('hex');

const escapeRegex = (value = '') => 
    String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getFrontendUrl = () => 
    (process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '');

const isValidPassword = (pwd) => pwd && pwd.length >= 6;

const generateSessionToken = (user) => {
    return jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Automatisation du rattachement des commandes anonymes
const linkGuestOrders = async (userId, email) => {
    try {
        const emailMatch = new RegExp(`^${escapeRegex(email)}$`, 'i');
        const result = await Order.updateMany(
            { customerEmail: emailMatch, $or: [{ userId: null }, { userId: { $exists: false } }] },
            { $set: { userId: userId } }
        );
        return result;
    } catch (err) {
        console.warn('Erreur liaison commandes:', err.message);
    }
};

// ==========================================
// SERVICE DE SÉCURITÉ EMAIL
// ==========================================

const createMailTransporter = () => {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    let smtpHost = process.env.SMTP_HOST;
    let smtpPort = Number(process.env.SMTP_PORT || 587);
    let smtpSecure = process.env.SMTP_SECURE === 'true';

    if (!smtpUser || !smtpPass || smtpUser === 'votre.email@gmail.com') return null;

    if (!smtpHost && smtpUser.toLowerCase().endsWith('@gmail.com')) {
        smtpHost = 'smtp.gmail.com';
        smtpPort = 465;
        smtpSecure = true;
    }
    if (!smtpHost) return null;

    return nodemailer.createTransport({
        host: smtpHost, port: smtpPort, secure: smtpSecure,
        auth: { user: smtpUser, pass: smtpPass }
    });
};

const sendPasswordResetEmail = async ({ email, username, resetLink }) => {
    const transporter = createMailTransporter();
    if (!transporter) return false;

    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Réinitialisation de votre mot de passe Star Mousse',
        html: `
            <div style="font-family: Arial, sans-serif; color: #151522; line-height: 1.6;">
                <h2>Bonjour ${username || ''}</h2>
                <p>Vous avez demandé la réinitialisation de votre mot de passe Star Mousse.</p>
                <p><a href="${resetLink}" style="display:inline-block;background:#b52f2f;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;">Changer mon mot de passe</a></p>
                <p>Ce lien expire dans 1 heure.</p>
            </div>
        `
    });
    return true;
};

// ==========================================
// CONTRÔLEURS DE GESTION DES COMPTES
// ==========================================

exports.addUser = async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;
        if (!isValidPassword(password)) {
            return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères." });
        }

        const newUser = new User({
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password,
            phone: phone.trim(),
            role: 'client' 
        });
        await newUser.save();
        
        const token = generateSessionToken(newUser);
        res.status(201).json({ message: "Utilisateur créé avec succès", user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role }, token });
    } catch (error) {
        res.status(400).json({ error: error.code === 11000 ? "Cet email est déjà utilisé." : error.message });
    }
};

exports.createEmployerByAdmin = async (req, res) => {
    try {
        const { username, email, password, phone, role } = req.body;
        if (!username?.trim() || !email?.trim() || !isValidPassword(password) || !phone?.trim()) {
            return res.status(400).json({ error: "Tous les champs sont requis." });
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
        res.status(201).json({ message: "Compte employeur créé avec succès", user: { id: newEmployer._id, username: newEmployer.username, role: newEmployer.role } });
    } catch (error) {
        res.status(500).json({ error: error.code === 11000 ? "Cet email est déjà utilisé." : error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email?.trim() || !password) return res.status(400).json({ error: "Email et mot de passe requis." });
        
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: "Base de données hors ligne." });
        }

        const user = await User.Login(email.trim().toLowerCase(), password);
        await linkGuestOrders(user._id, user.email);

        const token = generateSessionToken(user);
        res.status(200).json({ message: "Connexion réussie", user, token });
    } catch (error) {
        if (error?.message?.includes('timeout') || error?.name === 'MongooseError') {
            return res.status(503).json({ error: "Service temporairement indisponible." });
        }
        res.status(401).json({ error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email?.trim().toLowerCase() });
        if (!user) return res.status(404).json({ error: "Email non trouvé." });

        const token = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = getResetTokenHash(token);
        user.passwordResetExpires = new Date(Date.now() + 3600000); 
        await user.save();

        const resetLink = `${getFrontendUrl()}/reset-password/${token}`;
        const emailSent = await sendPasswordResetEmail({ email: user.email, username: user.username, resetLink });

        res.status(200).json({ message: "Lien envoyé.", emailSent, resetLink: process.env.NODE_ENV !== 'production' ? resetLink : undefined });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la génération du lien." });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        if (!isValidPassword(password)) return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères." });
        if (password !== confirmPassword) return res.status(400).json({ error: "Les mots de passe ne correspondent pas." });

        const user = await User.findOne({ 
            passwordResetToken: getResetTokenHash(token), 
            passwordResetExpires: { $gt: new Date() } 
        });
        if (!user) return res.status(400).json({ error: "Lien invalide ou expiré." });

        user.password = password;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();

        res.status(200).json({ message: "Mot de passe mis à jour." });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur." });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Utilisateur supprimé" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.logout = (req, res) => res.status(200).json({ message: "Déconnexion réussie" });

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, phone, address } = req.body;
        const userId = req.user._id;
        const userEmail = req.user.email;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

        if (username?.trim()) user.username = username.trim();
        if (phone?.trim()) user.phone = phone.trim();
        if (address !== undefined) user.address = address.trim();
        await user.save();

        const updateData = {};
        if (username) updateData.customerName = username.trim();
        if (phone) updateData.phone = phone.trim();
        if (address !== undefined) updateData.address = address.trim();
        const emailMatch = new RegExp(`^${escapeRegex(userEmail)}$`, 'i');

        if (Object.keys(updateData).length > 0) {
            await linkGuestOrders(userId, userEmail);
            await Order.updateMany({ $or: [{ userId: userId }, { customerEmail: emailMatch }] }, { $set: updateData });
            await Client.findOneAndUpdate({ email: emailMatch }, { $set: { name: username?.trim(), phone: phone?.trim() } }).catch(() => null);
        }

        res.status(200).json({ message: 'Profil mis à jour.', success: true, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!isValidPassword(newPassword)) return res.status(400).json({ error: 'Mot de passe invalide.' });

        const user = await User.findById(req.user._id);
        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(400).json({ error: 'Mot de passe actuel incorrect.' });
        }

        user.password = newPassword; 
        await user.save();
        res.status(200).json({ message: 'Mot de passe mis à jour.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUserByAdmin = async (req, res) => {
    try {
        const { username, email, password, phone, role } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

        if (username?.trim()) user.username = username.trim();
        if (email?.trim()) user.email = email.trim().toLowerCase();
        if (phone?.trim()) user.phone = phone.trim();
        if (role) user.role = role;
        if (isValidPassword(password)) user.password = password;

        await user.save();
        res.status(200).json({ message: 'Utilisateur mis à jour par l\'administrateur', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};