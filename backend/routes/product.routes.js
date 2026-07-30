const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.Controller');
const { requireAuthUser, requireAdmin, requireEmployeeOrAdmin } = require('../middleware/authMiddlewares');
const uploadfile = require('../middleware/uploadfile');
const { cacheMiddleware, cacheInvalidationMiddleware } = require('../middleware/cacheMiddleware');

const productCacheKey = (suffix) => (req) => `products:${suffix}:${req.originalUrl || req.url}`;
const invalidateProducts = ['products:*'];

router.get('/', cacheMiddleware(300, productCacheKey('all')), productController.getAllProducts);
router.get('/recommended', cacheMiddleware(300, productCacheKey('recommended')), productController.getRecommendedProducts);
router.get('/filter', cacheMiddleware(300, productCacheKey('filter')), productController.filterProducts);
router.get('/search', cacheMiddleware(300, productCacheKey('search')), productController.searchProductByName);

router.post('/add', requireAuthUser, requireEmployeeOrAdmin, cacheInvalidationMiddleware(invalidateProducts), productController.addProduct);
router.post('/addWithImage', requireAuthUser, requireEmployeeOrAdmin, uploadfile.single('image'), cacheInvalidationMiddleware(invalidateProducts), productController.addProductWithImage);

router.get('/:idProduct', cacheMiddleware(600, productCacheKey('detail')), productController.getProductById);
router.put('/update/:id', requireAuthUser, requireEmployeeOrAdmin, cacheInvalidationMiddleware(invalidateProducts), productController.updateProduct);
router.delete('/delete/:id', requireAuthUser, requireEmployeeOrAdmin, cacheInvalidationMiddleware(invalidateProducts), productController.deleteProduct);

module.exports = router;
