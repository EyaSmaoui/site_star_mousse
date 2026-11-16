const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

const positiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const keyFromEmailOrIp = (req) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  return `${ipKeyGenerator(req.ip)}:${email || 'anonymous'}`;
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

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonRateLimitHandler('Trop de requetes, veuillez reessayer plus tard'),
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: false,
  keyGenerator: keyFromEmailOrIp,
  handler: jsonRateLimitHandler('Trop de tentatives de connexion, veuillez reessayer dans 15 minutes'),
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  keyGenerator: keyFromEmailOrIp,
  handler: jsonRateLimitHandler('Trop de tentatives de reinitialisation de mot de passe, veuillez reessayer plus tard'),
});

const forgotPasswordLimiter = (req, res, next) => next();

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
  handler: jsonRateLimitHandler('Trop de requetes IA, veuillez reessayer plus tard'),
});

const createUpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
  handler: jsonRateLimitHandler('Trop de requetes de creation/modification, veuillez reessayer plus tard'),
});

const deleteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
  handler: jsonRateLimitHandler('Trop de tentatives de suppression, veuillez reessayer plus tard'),
});

module.exports = {
  globalLimiter,
  authLimiter,
  passwordResetLimiter,
  forgotPasswordLimiter,
  aiLimiter,
  createUpdateLimiter,
  deleteLimiter,
  positiveInt,
};
