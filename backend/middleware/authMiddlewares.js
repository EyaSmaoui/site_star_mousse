const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

// [SÉCURITÉ DÉMARRAGE] : Arrête le serveur si la clé secrète JWT n'est pas configurée dans le fichier .env
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set. Please configure it in .env');
}

// [MÉTHODE UTILITAIRE] : Récupère le Jeton (Token) envoyé par le Front-end (depuis les Cookies ou l'en-tête de la requête HTTP)
const getTokenFromRequest = (req) => {
  if (req.cookies?.token) return req.cookies.token;
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
};

// [FL SITE] : PROTECTION ESPACE CLIENT ("Mes commandes", "Mon Profil")
// Bloque l'accès si le client n'est pas connecté. S'il n'y a pas de jeton valide, il renvoie une erreur 401 pour forcer l'affichage de la page Login.
const requireAuthUser = async (req, res, next) => {
  const startedAt = Date.now();
  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ error: 'Token not found' });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET); // Décode le token pour lire l'ID de l'utilisateur
    const user = await userModel
      .findById(decodedToken.userId || decodedToken.id)
      .select('role username email') // Sécurité : charge uniquement le profil sans le mot de passe
      .maxTimeMS(3000)
      .lean();
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }
    req.user = user; // Sauvegarde les infos de l'utilisateur pour les utiliser dans l'action suivante
    
    if (Date.now() - startedAt > 1000) {
      console.warn(`[auth] Vérification lente: ${Date.now() - startedAt}ms ${req.method} ${req.originalUrl}`);
    }
    next(); // Autorise l'accès à la page demandée
  } catch (error) {
    if (error?.message?.includes('operation exceeded time limit')) {
      return res.status(503).json({ error: 'Base utilisateurs lente ou indisponible' });
    }
    return res.status(401).json({ error: 'Token invalide' });
  }
};

// [FL SITE] : RECHERCHE PERSONNALISÉE / CHATBOT INTERACTIF
// N'interrompt pas la navigation si le visiteur est un invité anonyme. Mais si le client est connecté, il charge son profil pour que le chatbot puisse l'appeler par son nom.
const optionalAuthUser = async (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) return next(); // Si pas connecté, continue le parcours en mode invité anonyme

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const user = await userModel
      .findById(decodedToken.userId || decodedToken.id)
      .select('role username email')
      .maxTimeMS(3000)
      .lean();
    if (user) req.user = user;
  } catch {
    req.user = null; // En cas de token expiré, oublie l'erreur et reste en mode invité
  }

  next();
};

// [FL SITE] : DASHBOARD SUPER ADMIN (Actions critiques)
// Sécurité stricte pour le Back-Office : Bloque l'accès et renvoie une erreur 403 si l'utilisateur connecté n'est pas le Super Administrateur du site Star Mousse.
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Utilisateur non authentifié' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès administrateur requis' });
  }
  next();
};

// [FL SITE] : PANNEAU DE GESTION STAFF (Gestion des commandes et des stocks de matelas)
// Sécurité du Back-Office basée sur les rôles (RBAC) : Autorise uniquement le personnel de l'entreprise (Admin, Manager, Employé) à manipuler les produits et voir le tableau des commandes.
const requireEmployeeOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Utilisateur non authentifié' });
  }
  // Vérification de l'autorisation parmi la liste des rôles internes permis
  if (!['admin', 'manager', 'employee', 'employeur'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Accès employé ou administrateur requis' });
  }
  next();
};

module.exports = { requireAuthUser, optionalAuthUser, requireAdmin, requireEmployeeOrAdmin };