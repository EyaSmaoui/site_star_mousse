const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.Controller'); 

// Explicit routes (MUST be before parameterized routes to avoid capture)
router.get('/getAllProducts', productController.getAllProducts);
router.get('/filter', productController.filterProducts);
router.get('/searchProductByName', productController.searchProductByName);
router.get('/addProductWithImage', productController.addProductWithImage);

// Parameterized routes (AFTER explicit routes)
router.get('/:idProduct', productController.getProductById);
router.post('/addProduct', productController.addProduct);
router.put('/updateProduct/:id', productController.updateProduct);
router.delete('/deleteProduct/:id', productController.deleteProduct);
module.exports = router;