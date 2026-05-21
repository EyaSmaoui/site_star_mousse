const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.Controller');
const { requireAuthUser, requireAdmin } = require('../middleware/authMiddlewares');

// Routes principales
router.get('/', productController.getAllProducts); // GET /api/products
router.get('/recommended', productController.getRecommendedProducts);
router.get('/filter', productController.filterProducts);
router.get('/search', productController.searchProductByName);

// Ajout produit
router.post('/add', requireAuthUser, requireAdmin, productController.addProduct);
router.post('/addWithImage', requireAuthUser, requireAdmin, productController.addProductWithImage);

// Routes paramétrées
router.get('/:idProduct', productController.getProductById);
router.put('/update/:id', requireAuthUser, requireAdmin, productController.updateProduct);
router.delete('/delete/:id', requireAuthUser, requireAdmin, productController.deleteProduct);

module.exports = router;
