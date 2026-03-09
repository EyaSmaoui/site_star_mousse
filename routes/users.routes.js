// routes/users.routes.js
const express = require('express');
const router = express.Router();
const uploadfile = require('../middleware/uploadfile');
const {requireAuthUser} = require('../middleware/authMiddlewares');
// Controller
const userController = require('../controllers/user.Controller');
const productController = require('../controllers/product.Controller');
// Routes existantes
router.get('/', userController.getAllUsers);
router.get('/esm', userController.esm);
router.get('/getAllUsers',requireAuthUser, userController.getAllUsers);//protect route
router.post('/addUser', userController.addUser);
router.post('/addAdmin', userController.addAdmin);
router.delete('/deleteUser/:id',requireAuthUser, userController.deleteUser);//protect route
router.put('/updateUser/:id',requireAuthUser, userController.UpdateUser);//protect route
router.get('/getAllUsers', userController.getAllUsers);
router.get('/getAllUsers', userController.getAllUsers);
router.get('/search', userController.searchUsers);
router.post('/adduserWithPhoto', uploadfile.single('photo'), userController.adduserWithPhoto);
router.post('/login', userController.login);
router.get('/getAuthUser', requireAuthUser, userController.getAuthUser);//protect route

module.exports = router;