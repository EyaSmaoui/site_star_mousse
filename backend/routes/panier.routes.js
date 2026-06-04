const express = require('express');
const router = express.Router();
const cartController = require('../controllers/panier.Controller');
const { requireAuthUser } = require('../middleware/authMiddlewares');
const { verifyCartOwnership } = require('../middleware/ownershipCheck');

// CRUD
router.get('/C', requireAuthUser, cartController.getAllCarts);
router.get('/:id', requireAuthUser, verifyCartOwnership, cartController.getCartById);
router.post('/addCart', requireAuthUser, cartController.addCart);
router.put('/updateCart/:id', requireAuthUser, verifyCartOwnership, cartController.updateCart);
router.delete('/deleteCart/:id', requireAuthUser, verifyCartOwnership, cartController.deleteCart);

// Extra actions
router.post('/addProduct/:id', requireAuthUser, verifyCartOwnership, cartController.addProductToCart);
router.delete('/removeProduct/:id', requireAuthUser, verifyCartOwnership, cartController.removeProductFromCart);

module.exports = router;