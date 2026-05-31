const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.Controller');
const { requireAuthUser, requireAdmin } = require('../middleware/authMiddlewares');

// Routes Publiques
router.post('/addUser', userController.addUser);
router.post('/register', userController.addUser);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);
router.get('/logout', userController.logout);

// Routes Protégées
router.get('/profile', requireAuthUser, userController.getProfile);
router.put('/update-profile', requireAuthUser, userController.updateProfile);
router.put('/change-password', requireAuthUser, userController.changePassword);
router.post('/create-employer', requireAuthUser, requireAdmin, userController.createEmployerByAdmin);
router.put('/update-user/:id', requireAuthUser, requireAdmin, userController.updateUserByAdmin);
router.get('/getAllUsers', requireAuthUser, requireAdmin, userController.getAllUsers);
router.delete('/deleteUser/:id', requireAuthUser, requireAdmin, userController.deleteUser);

module.exports = router;
