const express = require('express');
const router = express.Router();
const cartController = require('../controllers/panier.Controller');

// CRUD
router.get('/getAllCarts', cartController.getAllCarts);
router.get('/:id', cartController.getCartById);
router.post('/addCart', cartController.addCart);
router.put('/updateCart/:id', cartController.updateCart);
router.delete('/deleteCart/:id', cartController.deleteCart);

// Extra actions
router.post('/addProduct/:id', cartController.addProductToCart);
router.delete('/removeProduct/:id', cartController.removeProductFromCart);

module.exports = router;