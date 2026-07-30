const hasDangerousKey = (key) => key.startsWith('$') || key.includes('.');

const sanitizeValue = (value) => {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (typeof value !== 'object') return value;

  return Object.entries(value).reduce((acc, [key, nestedValue]) => {
    if (hasDangerousKey(key)) return acc;
    acc[key] = sanitizeValue(nestedValue);
    return acc;
  }, Array.isArray(value) ? [] : {});
};

const sanitizeRequestPart = (part) => {
  if (!part || typeof part !== 'object') return part;
  return sanitizeValue(part);
};

const mongoSanitizeMiddleware = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeRequestPart(req.body);
  }

  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeRequestPart(req.params);
  }

  req.sanitizedQuery = sanitizeRequestPart(req.query);

  next();
};

module.exports = mongoSanitizeMiddleware;
