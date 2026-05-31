const Product = require('../models/product.model');
const Recommendation = require('../models/recommendation.model');
const { PRODUCT_CATALOG } = require('../services/recommendationEngine');
const { inferProductImage, withProductImage } = require('../services/productImages');
module.exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.status(200).json(products.map(withProductImage));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports.getProductById = async (req, res) => {
    try {
        const { idProduct } = req.params;
        const product = await Product.findById(idProduct);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(withProductImage(product));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports.getRecommendedProducts = async (req, res) => {
    try {
        const limit = Math.min(Number(req.query.limit) || 6, 12);
        const recommendations = await Recommendation.find()
            .populate('product')
            .sort({ rank: -1, averageRating: -1, reviewCount: -1 })
            .limit(limit);

        const activeRecommendations = recommendations
            .filter((item) => item.product && item.product.isAvctive !== false)
            .map((item) => ({
                ...withProductImage(item.product),
                recommendation: {
                    averageRating: item.averageRating,
                    reviewCount: item.reviewCount,
                    sentimentScore: item.sentimentScore,
                    rank: item.rank,
                    reason: item.reason,
                    updatedAt: item.updatedAt
                }
            }));

        if (activeRecommendations.length) {
            return res.status(200).json(activeRecommendations);
        }

        const fallbackProducts = await Product.find({ isAvctive: { $ne: false } })
            .sort({ recommendationRank: -1, averageRating: -1, reviewCount: -1, price: 1 })
            .limit(limit);

        res.status(200).json(fallbackProducts.length ? fallbackProducts.map(withProductImage) : PRODUCT_CATALOG.slice(0, limit));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports.addProduct = async (req, res) => {
    try {
        const { productId, name, description, price, category, stock, warranty, image, color, size } = req.body;
        const newProduct = new Product({
            productId,
            name,
            description,
            price,
            category,
            stock,
            warranty,
            image: image || inferProductImage(name),
            color,
            size
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};  
module.exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updated = await Product.findByIdAndUpdate(id, updates, { new: true });
        if (!updated) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports.addProductWithImage = async (req, res) => {
    try {
        const { productId, name, description, price, category, stock, warranty, color, size } = req.body;
        const image = req.file ? `/images/${req.file.filename}` : inferProductImage(name);
        const newProduct = new Product({
            productId,
            name,
            description,
            price,
            category,
            stock,
            warranty,
            image,
            color,
            size
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
           
    }
};
module.exports.searchProductByName = async (req, res) => {
    try {
        const { name } = req.query;//recuperer le nom
        const product = await Product.find({ name }); //chercher un produit par son nom
        if(!product){
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product.map(withProductImage));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }           
};
module.exports.filterProducts = async (req, res) => {
    try {
        const { size, minPrice, maxPrice } = req.query;
        const filter = {};
        if (size) filter.size = size;
        if (minPrice) filter.price = { $gte: minPrice };
        if (maxPrice) filter.price = { ...filter.price, $lte: maxPrice };
        const products = await Product.find(filter);
        res.status(200).json(products.map(withProductImage));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
    
