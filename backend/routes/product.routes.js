const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.Controller');
const { requireAuthUser, requireAdmin, requireEmployeeOrAdmin } = require('../middleware/authMiddlewares');
const uploadfile = require('../middleware/uploadfile');

// Routes principales
router.get('/', productController.getAllProducts); // GET /api/products
router.get('/recommended', productController.getRecommendedProducts);
router.get('/filter', productController.filterProducts);
router.get('/search', productController.searchProductByName);

// Ajout produit
router.post('/add', requireAuthUser, requireEmployeeOrAdmin, productController.addProduct);
router.post('/addWithImage', requireAuthUser, requireEmployeeOrAdmin, uploadfile.single('image'), productController.addProductWithImage);

// Routes paramétrées
router.get('/:idProduct', productController.getProductById);
router.put('/update/:id', requireAuthUser, requireEmployeeOrAdmin, productController.updateProduct);
router.delete('/delete/:id', requireAuthUser, requireEmployeeOrAdmin, productController.deleteProduct);

module.exports = router;
