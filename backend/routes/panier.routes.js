const express = require('express');
const router = express.Router();
const cartController = require('../controllers/panier.Controller');
const { requireAuthUser } = require('../middleware/authMiddlewares');

// CRUD
router.get('/C', requireAuthUser, cartController.getAllCarts);
router.get('/:id', requireAuthUser, cartController.getCartById);
router.post('/addCart', requireAuthUser, cartController.addCart);
router.put('/updateCart/:id', requireAuthUser, cartController.updateCart);
router.delete('/deleteCart/:id', requireAuthUser, cartController.deleteCart);

// Extra actions
router.post('/addProduct/:id', requireAuthUser, cartController.addProductToCart);
router.delete('/removeProduct/:id', requireAuthUser, cartController.removeProductFromCart);

module.exports = router;