const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

// JWT_SECRET is mandatory — fail fast if not configured
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set. Please configure it in .env');
}

const getTokenFromRequest = (req) => {
  if (req.cookies?.token) return req.cookies.token;
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
};

const requireAuthUser = async (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ error: 'Token not found' });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const user = await userModel.findById(decodedToken.userId || decodedToken.id);
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};

const optionalAuthUser = async (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) return next();

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const user = await userModel.findById(decodedToken.userId || decodedToken.id);
    if (user) req.user = user;
  } catch {
    req.user = null;
  }

  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Utilisateur non authentifié' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès administrateur requis' });
  }
  next();
};

const requireEmployeeOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Utilisateur non authentifié' });
  }
  if (!['admin', 'manager', 'employee', 'employeur'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Accès employé ou administrateur requis' });
  }
  next();
};

module.exports = { requireAuthUser, optionalAuthUser, requireAdmin, requireEmployeeOrAdmin };

