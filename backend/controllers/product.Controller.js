const Product = require('../models/product.model');
const { withProductImage, inferProductImage } = require('../services/productImages');
const { getProductRecommendations } = require('../services/productRecommendation.service');

const EXCLUDED_BRANDS = ['Star mousse', 'Emma'];
const competitorBrandRegex = new RegExp(`\\b(?:${EXCLUDED_BRANDS.join('|')})\\b`, 'i');
const competitorNameFilter = {
  $regex: competitorBrandRegex.source,
  $options: competitorBrandRegex.flags.replace('g', ''),
};
const buildStarMousseFilter = (filter = {}) => ({
  $and: [
    filter,
    {
      $or: [
        { brand: { $exists: true, $nin: EXCLUDED_BRANDS } },
        {
          brand: { $exists: false },
          $nor: [
            { name: competitorNameFilter },
            { description: competitorNameFilter },
            { category: competitorNameFilter },
          ],
        },
      ],
    },
  ],
});

exports.getAllProducts = async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500);
    const skip = Math.max(Number(req.query.skip) || 0, 0);
    const products = await Product.find(buildStarMousseFilter({ isActive: true }))
      .select('productId name description price basePrice category stock warranty image images variants dimensions brand color size averageRating reviewCount isRecommended note_coeur sentimentScore recommendationRank lastRecommendationUpdate createdAt updatedAt')
      .sort({ isRecommended: -1, averageRating: -1, reviewCount: -1, name: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json(products.map(withProductImage));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.idProduct, isActive: true });
    if (!product) return res.status(404).json({ message: 'Produit introuvable.' });
    return res.status(200).json(withProductImage(product));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const slug = String(req.params.slug || '').trim().toLowerCase();
    const product = await Product.findOne({
      isActive: true,
      $or: [{ productId: slug }, { slug }],
    });
    if (!product) return res.status(404).json({ message: 'Produit introuvable.' });
    return res.status(200).json(withProductImage(product));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecommendedProducts = async (req, res) => {
  try {
    const parsedLimit = Number(req.query.limit);
    const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 12) : 6;
    const q = String(req.query.q || '').trim();
    const products = await getProductRecommendations({ q, limit });
    const cleanedProducts = products.map(({ _id, ...rest }) => rest);
    return res.status(200).json(cleanedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { productId, name, description, price, basePrice = price, category, stock, warranty, color, size, brand = 'Star Mousse', isActive = true } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : (req.body.image || inferProductImage(name));
    const newProduct = new Product({
      productId,
      name,
      description,
      basePrice,
      price,
      category,
      stock,
      warranty,
      image,
      color,
      size,
      brand,
      isActive,
    });
    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addProductWithImage = async (req, res) => {
  try {
    const { productId, name, description, price, basePrice = price, category, stock, warranty, color, size, brand = 'Star Mousse', isActive = true } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : null;
    const newProduct = new Product({
      productId,
      name,
      description,
      basePrice,
      price,
      category,
      stock,
      warranty,
      image,
      color,
      size,
      brand,
      isActive,
    });
    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Produit introuvable.' });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Produit introuvable.' });
    return res.status(200).json({ message: 'Produit supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchProductByName = async (req, res) => {
  try {
    const name = String(req.query.name || '').trim();
    const products = await Product.find(buildStarMousseFilter({ isActive: true, name: { $regex: new RegExp(name, 'i') } }))
      .limit(50)
      .lean();
    return res.status(200).json(products.map(withProductImage));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.filterProducts = async (req, res) => {
  try {
    const { size, minPrice, maxPrice, category } = req.query;
    const filter = { isActive: true };
    if (size) filter.size = size;
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const products = await Product.find(buildStarMousseFilter(filter))
      .sort({ averageRating: -1, reviewCount: -1 })
      .limit(100)
      .lean();
    return res.status(200).json(products.map(withProductImage));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
