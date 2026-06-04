// Rate limiting middleware
const rateLimit = require('express-rate-limit');

// Global rate limiter - 200 requests per 15 minutes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 200,
  message: 'Trop de requêtes, veuillez réessayer plus tard',
  standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,   // Disable `X-RateLimit-*` headers
});

// Stricter limiter for authentication endpoints - 5 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: false,  // Don't reset counter on successful request
  keyGenerator: (req) => {
    // Use email if available (for login/register), fallback to IP
    return req.body?.email || req.ip;
  },
  message: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes',
});

// Password reset limiter - 3 attempts per hour
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 3,
  keyGenerator: (req) => req.body?.email || req.ip,
  message: 'Trop de tentatives de réinitialisation de mot de passe, veuillez réessayer plus tard',
});

// Forgot password limiter - 5 attempts per 24 hours
const forgotPasswordLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,  // 24 hours
  max: 5,
  keyGenerator: (req) => req.body?.email || req.ip,
  message: 'Trop de tentatives, veuillez réessayer demain',
});

// Create/Update limiter - 100 per 15 minutes
const createUpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: 'Trop de requêtes de création/modification, veuillez réessayer plus tard',
});

// Delete limiter - 50 per 15 minutes (stricter than create/update)
const deleteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: 'Trop de tentatives de suppression, veuillez réessayer plus tard',
});

module.exports = {
  globalLimiter,
  authLimiter,
  passwordResetLimiter,
  forgotPasswordLimiter,
  createUpdateLimiter,
  deleteLimiter
};
