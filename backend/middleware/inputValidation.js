// Input validation and sanitization middleware
const { body, param, query, validationResult } = require('express-validator');
const mongoSanitize = require('express-mongo-sanitize');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Common validators
const validators = {
  email: () => body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  
  password: (minLength = 6) => body('password')
    .trim()
    .isLength({ min: minLength })
    .withMessage(`Le mot de passe doit contenir au moins ${minLength} caractères`),
  
  strongPassword: () => body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/[A-Z]/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule')
    .matches(/[0-9]/)
    .withMessage('Le mot de passe doit contenir au moins un chiffre')
    .matches(/[!@#$%^&*]/)
    .withMessage('Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)'),
  
  phone: () => body('phone')
    .trim()
    .matches(/^[0-9\s\-\+\(\)]+$/)
    .withMessage('Numéro de téléphone invalide')
    .isLength({ min: 8, max: 15 })
    .withMessage('Le numéro de téléphone doit contenir entre 8 et 15 caractères'),
  
  username: () => body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 50 caractères')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores'),
  
  mongoId: (paramName = 'id') => param(paramName)
    .isMongoId()
    .withMessage('ID invalide'),
  
  quantity: () => body('quantity')
    .isInt({ min: 1, max: 1000 })
    .withMessage('La quantité doit être entre 1 et 1000'),
  
  rating: () => body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('La note doit être entre 1 et 5'),
};

// Apply sanitization globally
const globalSanitization = [
  mongoSanitize(),  // Prevent NoSQL injection
  mongoSanitize({ replaceWith: '_' }),  // Replace $ and . in keys
];

module.exports = {
  handleValidationErrors,
  validators,
  globalSanitization
};
