const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.Controller');

// Routes pour les catégories
router.get('/getAllCategories', categoryController.getAllCategories);
router.get('/:idCategory', categoryController.getCategoryById);
router.post('/addCategory', categoryController.addCategory);
router.put('/updateCategory/:id', categoryController.updateCategory);
router.delete('/deleteCategory/:id', categoryController.deleteCategory);


module.exports = router;