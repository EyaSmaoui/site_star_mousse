// Rate limiting middleware
const rateLimit = require('express-rate-limit');

const positiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const keyFromEmailOrIp = (req) => {
  const email = req.body?.email;
  // Eviter de différentier des emails proches à cause des espaces/casse
  return email ? String(email).trim().toLowerCase() : req.ip;
};


const jsonRateLimitHandler = (message) => (req, res) => {
  const retryAfter = req.rateLimit?.resetTime
    ? Math.max(1, Math.ceil((req.rateLimit.resetTime.getTime() - Date.now()) / 1000))
    : undefined;

  if (retryAfter) {
    res.setHeader('Retry-After', String(retryAfter));
  }

  res.status(429).json({
    error: message,
    retryAfter,
  });
};


// Global rate limiter - 200 requests per 15 minutes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Trop de requetes, veuillez reessayer plus tard',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for authentication endpoints - 5 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: false,
  keyGenerator: keyFromEmailOrIp,
  message: 'Trop de tentatives de connexion, veuillez reessayer dans 15 minutes',
});

// Password reset limiter - 3 attempts per hour
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  keyGenerator: keyFromEmailOrIp,
  message: 'Trop de tentatives de reinitialisation de mot de passe, veuillez reessayer plus tard',
});

// Forgot password limiter - COMPLETELY DISABLED
const forgotPasswordLimiter = (req, res, next) => next();


// Create/Update limiter - 100 per 15 minutes
const createUpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: 'Trop de requetes de creation/modification, veuillez reessayer plus tard',
});

// Delete limiter - 50 per 15 minutes
const deleteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: 'Trop de tentatives de suppression, veuillez reessayer plus tard',
});

module.exports = {
  globalLimiter,
  authLimiter,
  passwordResetLimiter,
  forgotPasswordLimiter,
  createUpdateLimiter,
  deleteLimiter,
};
