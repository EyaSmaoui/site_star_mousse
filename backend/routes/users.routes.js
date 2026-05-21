const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.Controller');
const { requireAuthUser, requireAdmin } = require('../middleware/authMiddlewares');

// Routes Publiques
router.post('/addUser', userController.addUser);
router.post('/register', userController.addUser);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

// Routes Protégées
router.get('/profile', requireAuthUser, userController.getProfile);
router.put('/update-profile', requireAuthUser, userController.updateProfile);
router.post('/create-employer', requireAuthUser, requireAdmin, userController.createEmployerByAdmin);
router.put('/update-user/:id', requireAuthUser, requireAdmin, userController.updateUserByAdmin);
router.get('/getAllUsers', requireAuthUser, requireAdmin, userController.getAllUsers);
router.get('/getAllUsersWithPassword', requireAuthUser, requireAdmin, userController.getAllUsersWithPassword); // DEBUG ONLY
router.delete('/deleteUser/:id', requireAuthUser, requireAdmin, userController.deleteUser);

module.exports = router;