/**
 * STRUCTURED ERROR RESPONSE MIDDLEWARE
 * Standardise toutes les réponses d'erreur API
 */

class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Middleware pour capturer les erreurs non gérées
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Ne pas exposer les détails d'erreur en production
  const message = isDevelopment ? err.message : 'Erreur serveur';
  const details = isDevelopment ? err.details : null;

  // Logging
  const errorLog = {
    timestamp: new Date().toISOString(),
    statusCode,
    message: err.message,
    path: req.path,
    method: req.method,
    userId: req.user?.id || 'anonymous',
    ...(isDevelopment && { stack: err.stack })
  };

  if (statusCode >= 500) {
    console.error('🔴 Server Error:', errorLog);
  } else if (statusCode >= 400) {
    console.warn('🟡 Client Error:', errorLog);
  }

  // Réponse standardisée
  res.status(statusCode).json({
    error: {
      status: statusCode,
      message,
      ...(details && { details }),
      ...(isDevelopment && process.env.DEBUG_ERRORS && { debug: err.stack })
    },
    ...(process.env.NODE_ENV === 'development' && { timestamp: new Date().toISOString() })
  });
};

// Middleware pour les routes non trouvées
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      status: 404,
      message: `Route non trouvée: ${req.method} ${req.path}`
    }
  });
};

// Wrapper pour les contrôleurs async pour capturer les erreurs
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Créer une erreur API facilement
const createApiError = (statusCode, message, details = null) => {
  return new ApiError(statusCode, message, details);
};

module.exports = {
  ApiError,
  errorHandler,
  notFoundHandler,
  asyncHandler,
  createApiError
};
