const User = require('../models/user.model');
const Order = require('../models/order.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;

const getResetTokenHash = (token) =>
    crypto.createHash('sha256').update(token).digest('hex');

const escapeRegex = (value = '') =>
    String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getFrontendUrl = () =>
    (process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '');

const createMailTransporter = () => {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    let smtpHost = process.env.SMTP_HOST;
    let smtpPort = Number(process.env.SMTP_PORT || 587);
    let smtpSecure = process.env.SMTP_SECURE === 'true';

    const isPlaceholderConfig =
        !smtpUser ||
        !smtpPass ||
        smtpUser === 'votre.email@gmail.com' ||
        smtpPass === 'votre_mot_de_passe_d_application';

    if (isPlaceholderConfig) {
        return null;
    }

    if (!smtpHost && smtpUser.toLowerCase().endsWith('@gmail.com')) {
        smtpHost = 'smtp.gmail.com';
        smtpPort = Number(process.env.SMTP_PORT || 465);
        smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
    }

    if (!smtpHost) {
        return null;
    }

    return nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
            user: smtpUser,
            pass: smtpPass
        }
    });
};

const sendPasswordResetEmail = async ({ email, username, resetLink }) => {
    const transporter = createMailTransporter();
    if (!transporter) return false;

    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Reinitialisation de votre mot de passe Star Mousse',
        html: `
            <div style="font-family: Arial, sans-serif; color: #151522; line-height: 1.6;">
                <h2>Bonjour ${username || ''}</h2>
                <p>Vous avez demande la reinitialisation de votre mot de passe Star Mousse.</p>
                <p><a href="${resetLink}" style="display:inline-block;background:#b52f2f;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;">Changer mon mot de passe</a></p>
                <p>Ce lien expire dans 1 heure. Si vous n'etes pas a l'origine de cette demande, ignorez cet email.</p>
            </div>
        `
    });

    return true;
};

// Ajouter un utilisateur (Inscription)
exports.addUser = async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;

        // Validations ont été effectuées par express-validator dans les middlewares
        // Double check pour password strength
        const passwordRegex = /^.{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                error: "Le mot de passe doit contenir au moins 6 caractères." 
            });
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
                address: newUser.address || "",
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
    const startedAt = Date.now();
    try {
        const { email, password } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({ error: "L'email est requis." });
        }
        if (!password) {
            return res.status(400).json({ error: "Le mot de passe est requis." });
        }

        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: "Base de données non connectée. Vérifiez MongoDB puis réessayez." });
        }

        const user = await User.Login(email.trim().toLowerCase(), password);
        if (Date.now() - startedAt > 1000) {
            console.warn(`[auth-login] Connexion lente: ${Date.now() - startedAt}ms ${email.trim().toLowerCase()}`);
        }

        // Rattacher les commandes précédentes faites avec cet email au compte utilisateur
        try {
            await Order.updateMany(
                { customerEmail: user.email, $or: [{ userId: null }, { userId: { $exists: false } }] },
                { $set: { userId: user._id } }
            );
        } catch (linkErr) {
            console.warn('Impossible de rattacher les anciennes commandes:', linkErr.message);
        }

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
                phone: user.phone,
                address: user.address || "",
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error("Erreur login:", error.message);
        if (error?.message?.includes('operation exceeded time limit')) {
            return res.status(503).json({ error: "Base utilisateurs lente ou indisponible. Réessayez dans quelques secondes." });
        }
        if (error?.message?.includes('buffering timed out') || error?.message?.includes('Cannot call') || error?.name === 'MongooseError') {
            return res.status(503).json({ error: "Base de données indisponible. Vérifiez la connexion MongoDB." });
        }
        res.status(401).json({ error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !email.trim()) {
            return res.status(400).json({ error: "L'email est requis." });
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() });
        
        // Si l'email n'existe pas, retourner erreur directe
        if (!user) {
            return res.status(404).json({ error: "Email non trouvé dans la base de données." });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const resetLink = `${getFrontendUrl()}/reset-password/${token}`;

        user.passwordResetToken = getResetTokenHash(token);
        user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
        await user.save();

        let emailSent = false;
        try {
            emailSent = await sendPasswordResetEmail({
                email: user.email,
                username: user.username,
                resetLink
            });
        } catch (mailError) {
            console.error('Erreur envoi email resetPassword:', mailError.message);
            if (process.env.NODE_ENV === 'production') {
                throw mailError;
            }
        }

        const payload = { 
            message: "Lien de réinitialisation envoyé avec succès.",
            emailSent,
            email: user.email 
        };
        if (process.env.NODE_ENV !== 'production') {
            payload.resetLink = resetLink;
        }

        res.status(200).json(payload);
    } catch (error) {
        console.error('Erreur forgotPassword:', error);
        res.status(500).json({ error: "Impossible de créer le lien de réinitialisation." });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        if (!token) {
            return res.status(400).json({ error: "Token manquant." });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caracteres." });
        }
        if (confirmPassword !== undefined && password !== confirmPassword) {
            return res.status(400).json({ error: "Les mots de passe ne correspondent pas." });
        }

        const user = await User.findOne({
            passwordResetToken: getResetTokenHash(token),
            passwordResetExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({ error: "Lien invalide ou expire." });
        }

        user.password = password;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();

        res.status(200).json({ message: "Mot de passe mis a jour avec succes." });
    } catch (error) {
        console.error('Erreur resetPassword:', error);
        res.status(500).json({ error: "Impossible de reinitialiser le mot de passe." });
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
        const userId = req.user._id;
        const userEmail = req.user.email;
        
        console.log(`[UPDATE PROFILE] Début mise à jour pour utilisateur: ${userId} (${userEmail})`);
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Mise à jour des champs utilisateur
        if (username && username.trim()) user.username = username.trim();
        if (phone && phone.trim()) user.phone = phone.trim();
        if (address !== undefined) user.address = address.trim();

        // SAUVEGARDE en base de données
        await user.save();
        console.log(`[UPDATE PROFILE] ✅ User enregistré en BD: ${JSON.stringify({username: user.username, phone: user.phone, address: user.address})}`);

        // IMPORTANT: Propager les modifications à TOUS les documents liés dans la BD
        const updateData = {};
        if (username) updateData.customerName = username.trim();
        if (phone) updateData.phone = phone.trim();
        if (address !== undefined) updateData.address = address.trim();
        const emailMatch = new RegExp(`^${escapeRegex(userEmail)}$`, 'i');

        if (Object.keys(updateData).length > 0) {
            // 🔗 ÉTAPE 1: Lier les commandes par email qui n'ont pas userId
            const linkResult = await Order.updateMany(
                { customerEmail: emailMatch, $or: [{ userId: null }, { userId: { $exists: false } }] },
                { $set: { userId: userId } }
            );
            console.log(`[UPDATE PROFILE] 🔗 LIAISON: ${linkResult.modifiedCount} commandes liées au userId`);
            
            // ✏️ ÉTAPE 2: Mettre à jour TOUTES les commandes (par userId OU par email)
            const orderResult = await Order.updateMany(
                { $or: [{ userId: userId }, { customerEmail: emailMatch }] },
                { $set: { ...updateData, userId: userId } }
            );
            console.log(`[UPDATE PROFILE] ✅ ${orderResult.modifiedCount} commandes mises à jour`);
            
            // 🔍 VÉRIFICATION: Afficher les données après update
            const ordersAfterUpdate = await Order.find({ 
                $or: [
                    { userId: userId },
                    { customerEmail: emailMatch }
                ]
            }).lean();
            console.log(`[UPDATE PROFILE] 📊 Total commandes du client: ${ordersAfterUpdate.length}`);
            if (ordersAfterUpdate.length > 0) {
                console.log(`[UPDATE PROFILE] 📝 Première commande APRÈS update:`, {
                    _id: ordersAfterUpdate[0]._id,
                    customerName: ordersAfterUpdate[0].customerName,
                    phone: ordersAfterUpdate[0].phone,
                    address: ordersAfterUpdate[0].address,
                    customerEmail: ordersAfterUpdate[0].customerEmail,
                    userId: ordersAfterUpdate[0].userId
                });
            }
        }

        // Mise à jour du Client model si existant
        const Client = require('../models/client.model');
        const clientUpdate = {};
        if (username) clientUpdate.name = username.trim();
        if (phone) clientUpdate.phone = phone.trim();
        
        if (Object.keys(clientUpdate).length > 0) {
            const clientResult = await Client.findOneAndUpdate(
                { email: emailMatch },
                { $set: clientUpdate },
                { new: true }
            ).catch(() => null);
            if (clientResult) {
                console.log(`[UPDATE PROFILE] ✅ Client model enregistré en BD`);
            } else {
                console.log(`[UPDATE PROFILE] ℹ️ Aucun Client model trouvé pour ${userEmail}`);
            }
        }

        console.log(`[UPDATE PROFILE] ✅ TOUTES les modifications ont été enregistrées en BD`);

        res.status(200).json({
            message: 'Profil mis à jour avec succès dans toute la base de données',
            success: true,
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
        console.error(`[UPDATE PROFILE] ❌ Erreur: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Mot de passe actuel et nouveau mot de passe requis.' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 6 caracteres.' });
        }
        if (confirmPassword !== undefined && newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'Les mots de passe ne correspondent pas.' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouve' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Mot de passe actuel incorrect.' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Mot de passe mis a jour avec succes.' });
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
