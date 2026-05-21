const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.Controller');
const { requireAuthUser, requireAdmin } = require('../middleware/authMiddlewares');

// Routes pour les catégories
router.get('/getAllCategories', categoryController.getAllCategories);
router.get('/:idCategory', categoryController.getCategoryById);
router.post('/addCategory', requireAuthUser, requireAdmin, categoryController.addCategory);
router.put('/updateCategory/:id', requireAuthUser, requireAdmin, categoryController.updateCategory);
router.delete('/deleteCategory/:id', requireAuthUser, requireAdmin, categoryController.deleteCategory);


module.exports = router;