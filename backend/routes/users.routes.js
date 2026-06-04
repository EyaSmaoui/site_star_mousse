const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.Controller');
const { requireAuthUser, requireAdmin } = require('../middleware/authMiddlewares');
const { authLimiter, passwordResetLimiter, forgotPasswordLimiter } = require('../middleware/rateLimiters');
const { validators, handleValidationErrors } = require('../middleware/inputValidation');

// Routes Publiques
router.post('/addUser', 
  authLimiter,
  validators.username(),
  validators.email(),
  validators.phone(),
  validators.password(),
  handleValidationErrors,
  userController.addUser
);

router.post('/register',
  authLimiter,
  validators.username(),
  validators.email(),
  validators.phone(),
  validators.password(),
  handleValidationErrors,
  userController.addUser
);

router.post('/login',
  authLimiter,
  validators.email(),
  validators.password(),
  handleValidationErrors,
  userController.login
);

router.post('/forgot-password',
  validators.email(),
  handleValidationErrors,
  userController.forgotPassword
);

router.post('/reset-password/:token',
  passwordResetLimiter,
  validators.password(),
  handleValidationErrors,
  userController.resetPassword
);

router.get('/logout', userController.logout);

// Routes Protégées
router.get('/profile', requireAuthUser, userController.getProfile);

router.put('/update-profile',
  requireAuthUser,
  validators.username().optional(),
  validators.email().optional(),
  validators.phone().optional(),
  handleValidationErrors,
  userController.updateProfile
);

router.put('/change-password',
  requireAuthUser,
  validators.password('currentPassword'),
  validators.password('newPassword'),
  handleValidationErrors,
  userController.changePassword
);

router.post('/create-employer',
  requireAuthUser,
  requireAdmin,
  validators.username(),
  validators.email(),
  validators.phone(),
  validators.password(),
  handleValidationErrors,
  userController.createEmployerByAdmin
);

router.put('/update-user/:id',
  requireAuthUser,
  requireAdmin,
  validators.mongoId('id'),
  handleValidationErrors,
  userController.updateUserByAdmin
);

router.get('/getAllUsers',
  requireAuthUser,
  requireAdmin,
  userController.getAllUsers
);

router.delete('/deleteUser/:id',
  requireAuthUser,
  requireAdmin,
  validators.mongoId('id'),
  handleValidationErrors,
  userController.deleteUser
);

module.exports = router;
