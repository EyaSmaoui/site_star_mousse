// routes/users.routes.js
const express = require('express');
const router = express.Router();
const uploadfile = require('../middleware/uploadfile');

// Controller
const userController = require('../controllers/user.Controller');
const productController = require('../controllers/product.Controller');
// Routes existantes
router.get('/', userController.getAllUsers);
router.get('/esm', userController.esm);
router.get('/getAllUsers', userController.getAllUsers);
router.post('/addUser', userController.addUser);
router.post('/addAdmin', userController.addAdmin);
router.delete('/deleteUser/:id', userController.deleteUser);
router.put('/updateUser/:id', userController.UpdateUser);
router.get('/getAllUsers', userController.getAllUsers);
router.get('/getAllUsers', userController.getAllUsers);
router.get('/search', userController.searchUsers);
router.post('/adduserWithPhoto', uploadfile.single('photo'), userController.adduserWithPhoto);

module.exports = router;