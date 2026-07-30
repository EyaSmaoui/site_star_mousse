const Sentry = require('@sentry/node');
const logger = require('../logger');

const isOperationalError = (error) => {
  if (error.isOperational) return true;
  return ['ValidationError', 'CastError', 'MongoServerError'].includes(error.name);
};

const getStatusCode = (error) => {
  if (error.statusCode) return error.statusCode;
  if (error.status) return error.status;
  if (error.name === 'ValidationError') return 400;
  if (error.name === 'CastError') return 400;
  if (error.name === 'JsonWebTokenError') return 401;
  if (error.name === 'TokenExpiredError') return 401;
  if (error.name === 'MongoServerError' && error.code === 11000) return 409;
  if (error.type === 'entity.parse.failed') return 400;
  return 500;
};

const getPublicMessage = (error, statusCode) => {
  if (process.env.NODE_ENV === 'production') {
    return statusCode === 500 ? 'Internal server error' : error.message || 'Request failed';
  }
  return error.message || 'Request failed';
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const statusCode = getStatusCode(err);
  const errorPayload = {
    error: getPublicMessage(err, statusCode),
    status: statusCode,
    path: req.originalUrl || req.url,
    method: req.method,
  };

  if (process.env.NODE_ENV !== 'production') {
    errorPayload.details = err.details || err.errors || undefined;
    errorPayload.stack = err.stack;
  }

  if (statusCode >= 500 || !isOperationalError(err)) {
    loggerError(err, req, statusCode);
    if (Sentry && typeof Sentry.captureException === 'function' && process.env.SENTRY_DSN) {
      Sentry.captureException(err);
    }
  } else {
    logger.info('Handled API error', {
      statusCode,
      path: req.originalUrl || req.url,
      method: req.method,
      error: err.message,
    });
  }

  return res.status(statusCode).json(errorPayload);
};

const loggerError = (error, req, statusCode) => {
  require('../logger').error('Unhandled API error:', {
    error: error.message,
    name: error.name,
    stack: error.stack,
    statusCode,
    url: req.originalUrl || req.url,
    method: req.method,
    bodySize: Buffer.byteLength(JSON.stringify(req.body || {})),
  });
};

module.exports = errorHandler;
