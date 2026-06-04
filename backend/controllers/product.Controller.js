const Product = require('../models/product.model');
const { PRODUCT_CATALOG } = require('../services/recommendationEngine');
const { inferProductImage, withProductImage } = require('../services/productImages');
const { extractBudget, extractDimension } = require('../services/chatbot.utils');
const { getProductRecommendations } = require('../services/productRecommendation.service');

const normalizeQuery = (query) =>
    String(query || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .trim()
        .toLowerCase();

const buildSearchCriteria = (query) => {
    const normalized = normalizeQuery(query);
    const dimension = extractDimension(query);
    const maxPrice = dimension ? null : extractBudget(query);

    const budgetStopWords = new Set(['budget', 'soum', 'prix', 'b', 'dt', 'dinar', 'dinars']);
    const tokens = normalized
        .split(/\s+/)
        .filter(Boolean)
        .filter((token) => !budgetStopWords.has(token) && !/^\d+(dt)?$/.test(token));
    const criteria = { isAvctive: { $ne: false } };
    const or = [];
    const hasBabyIntent = /bebe|baby/i.test(normalized);
    const hasPillowIntent = /oreiller|pillow|cervical|cou/i.test(normalized);
    const hasBackIntent = /dos|dhar|orthop|orthoped|lombaire/i.test(normalized);
    const hasErgonomicIntent = /ergonomi|relax|premium|luxe|tendresse|haut gamme|haut de gamme/i.test(normalized);

    if (tokens.length && !hasBabyIntent && !hasPillowIntent && !hasBackIntent && !hasErgonomicIntent) {
        const escaped = tokens.map((token) => token.replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|');
        const regex = new RegExp(escaped, 'i');
        or.push({ name: { $regex: regex } });
        or.push({ description: { $regex: regex } });
        or.push({ category: { $regex: regex } });
    }

    if (hasPillowIntent) {
        or.push({ name: { $regex: /oreiller|pillow|cervical|cou/i } });
        or.push({ description: { $regex: /oreiller|pillow|cervical|cou/i } });
    }

    if (/dos|dhar|orthop|orthoped|orthop[eé]d|orthopedique/i.test(normalized)) {
        or.push({ category: { $regex: /orn?th?o|dhar|dos/i } });
        or.push({ name: { $regex: /confort|soft|venise|medico|orthop|dos|lombaire/i } });
        or.push({ description: { $regex: /confort|soft|venise|medico|orthop|dos|lombaire/i } });
    }

    if (hasErgonomicIntent) {
        or.push({ category: { $regex: /ergonomi|relax|premium|luxe|tendresse/i } });
        or.push({ name: { $regex: /ergonomi|relax|premium|luxe|tendresse/i } });
    }

    if (/bebe|bébé|baby/i.test(normalized)) {
        or.push({ category: { $regex: /bebe|bébé|baby/i } });
        or.push({ name: { $regex: /bebe|bébé|baby/i } });
    }

    if (or.length) {
        criteria.$or = or;
    }

    if (dimension) {
        const [width, height] = dimension.split('x');
        const dimensionRegex = new RegExp(`(^|\\D)(${width}\\s*[x*×/_-]\\s*${height}|${height}\\s*[x*×/_-]\\s*${width})(\\D|$)`, 'i');
        criteria.$and = [
            ...(criteria.$and || []),
            {
                $or: [
                    { size: { $regex: dimensionRegex } },
                    { name: { $regex: dimensionRegex } },
                    { description: { $regex: dimensionRegex } },
                ],
            },
        ];
    }

    if (maxPrice) {
        criteria.price = { $lte: maxPrice };
    }

    return criteria;
};

const fetchRecommendedProducts = async ({ q = '', limit = 6 }) => {
    const cleanQuery = String(q || '').trim();
    if (cleanQuery) {
        const criteria = buildSearchCriteria(cleanQuery);
        if (criteria.$or) {
            const matchedProducts = await Product.find(criteria)
                .sort({ recommendationRank: -1, averageRating: -1, reviewCount: -1, price: 1 })
                .limit(limit)
                .lean();
            if (matchedProducts.length) {
                return matchedProducts.map(withProductImage);
            }
            if (extractDimension(cleanQuery)) {
                return [];
            }
        }
    }

    const liveRecommendations = await getProductRecommendations({ limit, query: cleanQuery });
    if (liveRecommendations.length) {
        return liveRecommendations;
    }

    const fallbackProducts = await Product.find({ isAvctive: { $ne: false } })
        .sort({ recommendationRank: -1, averageRating: -1, reviewCount: -1, price: 1 })
        .limit(limit)
        .lean();

    return fallbackProducts.length ? fallbackProducts.map(withProductImage) : PRODUCT_CATALOG.slice(0, limit);
};

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
        const q = String(req.query.q || '').trim();
        const products = await fetchRecommendedProducts({ q, limit });
        res.status(200).json(products);
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
            size,
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports.fetchRecommendedProducts = fetchRecommendedProducts;
  
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
    
