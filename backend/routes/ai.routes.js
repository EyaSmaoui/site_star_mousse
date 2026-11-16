// backend/routes/ai.routes.js
const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Review = require('../models/review.model');
const logger = require('../logger');
const { requireAuthUser, requireEmployeeOrAdmin } = require('../middleware/authMiddlewares');
const { aiLimiter } = require('../middleware/rateLimiters');

/**
 * GET /api/ai/recommendations/:userId
 * Obtenir recommandations personnalisées
 */
router.get('/recommendations/:userId', requireAuthUser, aiLimiter, async (req, res) => {
  try {
    const { userId } = req.params;
    if (String(req.user._id) !== String(userId)) {
      return res.status(403).json({ error: 'Accès refusé.' });
    }
    const count = Math.min(Math.max(Number.parseInt(req.query.count, 10) || 5, 1), 20);

    // Récupérer les commandes passées de l'utilisateur
    const userOrders = await Order.find({ userId }).populate('products.product');
    const userHistory = userOrders.flatMap(o => o.products);

    // Récupérer tous les produits actifs
    const products = await Product.find({ isActive: true }).limit(20);

    // Générer recommandations IA
    const recommendations = await aiService.generateRecommendations(
      userId,
      userHistory,
      products,
      count
    );

    // Enrichir avec détails produits
    const enriched = [];
    for (const rec of recommendations.recommendations) {
      const product = products.find(p => p._id.toString() === rec.productId);
      if (product) {
        enriched.push({
          ...product.toObject(),
          reason: rec.reason,
        });
      }
    }

    res.json({
      success: true,
      recommendations: enriched.slice(0, count),
    });
  } catch (error) {
    logger.error('Erreur recommandations:', error);
    res.status(500).json({ error: 'Erreur lors de la génération des recommandations' });
  }
});

/**
 * POST /api/ai/search
 * Recherche sémantique intelligente
 */
router.post('/search', aiLimiter, async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length > 200) {
      return res.status(400).json({ error: 'Query manquante' });
    }

    // Générer embedding pour la requête
    const queryEmbedding = await aiService.generateEmbedding(query);

    if (!queryEmbedding) {
      // Fallback: recherche textuelle simple
      const products = await Product.find({
        $text: { $search: query },
        isActive: true,
      }).limit(10);
      return res.json({ success: true, results: products });
    }

    // Récupérer tous les produits
    const allProducts = await Product.find({ isActive: true });

    // Calculer similarité cosinus pour chaque produit
    const scored = await Promise.all(
      allProducts.map(async (product) => {
        const productText = `${product.name} ${product.description} ${product.category}`;
        const embedding = await aiService.generateEmbedding(productText);

        if (!embedding) return { product, score: 0 };

        const score = cosineSimilarity(queryEmbedding, embedding);
        return { product, score };
      })
    );

    // Trier par score
    const results = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(({ product, score }) => ({
        ...product.toObject(),
        relevanceScore: score,
      }));

    res.json({ success: true, query, results });
  } catch (error) {
    logger.error('Erreur recherche:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche' });
  }
});

/**
 * POST /api/ai/chatbot
 * Chat avec l'assistant IA
 */
router.post('/chatbot', aiLimiter, async (req, res) => {
  try {
    const { message, context = {} } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length > 2000) {
      return res.status(400).json({ error: 'Message manquant' });
    }

    // Appeler le chatbot IA
    const response = await aiService.chatbot(message, context);

    res.json({
      success: true,
      message,
      response,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Erreur chatbot:', error);
    res.status(500).json({ error: 'Erreur lors du traitement du message' });
  }
});

/**
 * POST /api/ai/analyze-review
 * Analyser sentiment d'un avis
 */
router.post('/analyze-review', requireEmployeeOrAdmin, aiLimiter, async (req, res) => {
  try {
    const { reviewText } = req.body;

    if (!reviewText) {
      return res.status(400).json({ error: 'Review text manquant' });
    }

    const analysis = await aiService.analyzeSentiment(reviewText);

    res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    logger.error('Erreur analyse:', error);
    res.status(500).json({ error: 'Erreur lors de l\'analyse' });
  }
});

/**
 * GET /api/ai/product-recommendations/:productId
 * Produits similaires basés sur embeddings
 */
router.get('/product-recommendations/:productId', aiLimiter, async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Générer embedding du produit
    const productText = `${product.name} ${product.description} ${product.category}`;
    const productEmbedding = await aiService.generateEmbedding(productText);

    if (!productEmbedding) {
      // Fallback: produits même catégorie
      const similar = await Product.find({
        category: product.category,
        _id: { $ne: productId },
        isActive: true,
      }).limit(5);
      return res.json({ success: true, similar });
    }

    // Trouver produits similaires
    const allProducts = await Product.find({
      _id: { $ne: productId },
      isActive: true,
    }).limit(30);

    const scored = await Promise.all(
      allProducts.map(async (p) => {
        const pText = `${p.name} ${p.description} ${p.category}`;
        const embedding = await aiService.generateEmbedding(pText);
        if (!embedding) return { product: p, score: 0 };

        const score = cosineSimilarity(productEmbedding, embedding);
        return { product: p, score };
      })
    );

    const similar = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ product: p, score }) => ({
        ...p.toObject(),
        similarity: score,
      }));

    res.json({ success: true, similar });
  } catch (error) {
    logger.error('Erreur produits similaires:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche' });
  }
});

/**
 * GET /api/ai/dynamic-price/:productId
 * Calculer prix dynamique
 */
router.get('/dynamic-price/:productId', requireEmployeeOrAdmin, aiLimiter, async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Calculer demande (nombre commandes ce mois)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentOrders = await Order.countDocuments({
      'products.product': productId,
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Score de demande (0-1)
    const demandScore = Math.min(recentOrders / 50, 1);

    // Pricing dynamique
    const pricing = aiService.calculateDynamicPrice(
      product.price,
      demandScore,
      product.stock,
    );

    res.json({
      success: true,
      productId,
      pricing,
      demandScore,
      stockLevel: product.stock,
    });
  } catch (error) {
    logger.error('Erreur prix dynamique:', error);
    res.status(500).json({ error: 'Erreur lors du calcul' });
  }
});

/**
 * GET /api/ai/stock-prediction/:productId
 * Prédire stock nécessaire
 */
router.get('/stock-prediction/:productId', requireEmployeeOrAdmin, aiLimiter, async (req, res) => {
  try {
    const { productId } = req.params;
    const days = Math.min(Math.max(Number.parseInt(req.query.days, 10) || 30, 1), 365);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Historique ventes (90 derniers jours)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const salesHistory = await Order.aggregate([
      {
        $match: {
          'items.product': product._id,
          createdAt: { $gte: ninetyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dailySales = salesHistory.map(s => s.count);
    const prediction = aiService.predictStockNeeded(
      dailySales || [1], // fallback si pas de données
      product.stock,
      days
    );

    res.json({
      success: true,
      productId,
      prediction,
      salesHistory,
    });
  } catch (error) {
    logger.error('Erreur prédiction:', error);
    res.status(500).json({ error: 'Erreur lors de la prédiction' });
  }
});

/**
 * Calculer similarité cosinus entre deux vecteurs
 */
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

module.exports = router;
