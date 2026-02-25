const Product = require('../models/product.model');
module.exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
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
        res.status(200).json(product);
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
        const{ name,size} = req.body;
        const image = req.file ? req.file.path : null;
        const newProduct = new Product({name,size,image});
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
        res.status(200).json(product);
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
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
    