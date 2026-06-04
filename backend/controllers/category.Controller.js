const Category = require('../models/category.model');
const { createApiError } = require('../middleware/errorHandler');

//get all categories
module.exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
    }
};


//get category by id
module.exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Catégorie non trouvée' });
        }
        res.status(200).json(category);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ error: 'ID de catégorie invalide' });
        }
        res.status(500).json({ error: 'Erreur lors de la récupération de la catégorie' });
    }
};

//create category
module.exports.addCategory = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ error: 'Le nom de la catégorie est requis' });
        }
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la catégorie' });
    }
};

//update category
module.exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) {
            return res.status(404).json({ error: 'Catégorie non trouvée' });
        }
        res.status(200).json(category);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ error: 'ID de catégorie invalide' });
        }
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la catégorie' });
    }
};

//delete category
module.exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Catégorie non trouvée' });
        }
        res.status(200).json({ message: 'Catégorie supprimée avec succès' });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ error: 'ID de catégorie invalide' });
        }
        res.status(500).json({ error: 'Erreur lors de la suppression de la catégorie' });
    }
};
