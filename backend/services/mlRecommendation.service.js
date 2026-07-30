const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Review = require('../models/review.model');
const RecommendationEvent = require('../models/recommendationEvent.model');
const logger = require('../logger');

const ACTIVE_PRODUCT_FILTER = { isActive: true };
const PRODUCT_FIELDS = 'name price category image averageRating reviewCount stock isRecommended recommendationRank';

const normalizeLimit = (limit, fallback = 6) => Math.min(Math.max(Number(limit) || fallback, 1), 24);

const productIdentity = (product) => String(product?._id || product?.id || '');

const extractOrderProductIds = (order = {}) => {
  const items = Array.isArray(order.items) ? order.items : [];
  const products = Array.isArray(order.products) ? order.products : [];
  const ids = new Set();

  [...items, ...products].forEach((item) => {
    const productId = item?.product || item?.productId || item?._id;
    if (productId) ids.add(String(productId));
  });

  return ids;
};

const decorateProducts = ({ products, scores = {}, reason, strategy }) => products.map((product) => ({
  ...product,
  score: scores[productIdentity(product)] ?? product.score ?? 0,
  reason,
  strategy,
}));

async function fetchProductsByIds(ids, scores = {}, reason = 'Recommandé par Star Mousse', strategy = 'fallback') {
  const uniqueIds = [...new Set(ids.filter(Boolean).map(String))];
  if (!uniqueIds.length) return [];

  const products = await Product.find({ _id: { $in: uniqueIds }, ...ACTIVE_PRODUCT_FILTER })
    .select(PRODUCT_FIELDS)
    .lean();

  const productById = new Map(products.map((product) => [productIdentity(product), product]));

  return uniqueIds
    .map((id) => productById.get(id))
    .filter(Boolean)
    .map((product) => ({
      ...product,
      score: scores[productIdentity(product)] ?? product.score ?? 0,
      reason,
      strategy,
    }));
}

async function getCollaborativeRecommendations(userId, limit = 5) {
  try {
    if (!userId) return [];

    const safeLimit = normalizeLimit(limit, 5);
    const userOrders = await Order.find({ userId })
      .select('items products')
      .lean();

    if (!userOrders.length) return [];

    const userProductIds = new Set();
    userOrders.forEach((order) => extractOrderProductIds(order).forEach((id) => userProductIds.add(id)));

    if (!userProductIds.size) return [];

    const similarOrders = await Order.find({
      userId: { $ne: userId },
      $or: [
        { 'products.product': { $in: Array.from(userProductIds) } },
        { 'items.product': { $in: Array.from(userProductIds) } },
      ],
    })
      .select('items products')
      .lean();

    const productScores = {};
    similarOrders.forEach((order) => {
      extractOrderProductIds(order).forEach((productId) => {
        if (!userProductIds.has(productId)) {
          productScores[productId] = (productScores[productId] || 0) + 1;
        }
      });
    });

    const recommendedIds = Object.entries(productScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, safeLimit)
      .map(([id]) => id);

    return fetchProductsByIds(recommendedIds, productScores, 'Clients similaires ont aussi acheté', 'collaborative');
  } catch (error) {
    logger.error('Collaborative filtering error:', { message: error.message, stack: error.stack });
    return [];
  }
}

async function getContentBasedRecommendations(productId, limit = 5) {
  try {
    if (!productId) return [];

    const safeLimit = normalizeLimit(limit, 5);
    const product = await Product.findById(productId)
      .select(`${PRODUCT_FIELDS} description`)
      .lean();

    if (!product || !product.isActive) return [];

    const priceRange = product.price > 0 ? product.price * 0.3 : 1;

    const similarProducts = await Product.find({
      _id: { $ne: productId },
      ...ACTIVE_PRODUCT_FILTER,
      $or: [
        { category: product.category },
        {
          price: {
            $gte: product.price - priceRange,
            $lte: product.price + priceRange,
          },
        },
      ],
    })
      .select(PRODUCT_FIELDS)
      .sort({ averageRating: -1, reviewCount: -1 })
      .limit(safeLimit * 2)
      .lean();

    const scoredProducts = similarProducts.map((p) => {
      let score = 0;

      if (p.category === product.category) score += 50;

      if (product.price > 0) {
        const priceDiff = Math.abs((p.price || 0) - product.price);
        score += Math.max(0, 30 - (priceDiff / product.price) * 30);
      }

      if (p.averageRating && product.averageRating) {
        const ratingDiff = Math.abs(p.averageRating - product.averageRating);
        score += Math.max(0, 20 - ratingDiff * 4);
      }

      return { ...p, score };
    });

    return scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, safeLimit)
      .map((product) => ({
        ...product,
        reason: 'Produits similaires',
        strategy: 'content-based',
      }));
  } catch (error) {
    logger.error('Content-based filtering error:', { message: error.message, stack: error.stack });
    return [];
  }
}

async function getHybridRecommendations(userId, productId = null, limit = 6) {
  try {
    const safeLimit = normalizeLimit(limit, 6);
    const collaborativeLimit = userId ? Math.ceil(safeLimit * 0.35) : 0;
    const contentLimit = productId ? Math.ceil(safeLimit * 0.35) : 0;
    const trendingLimit = Math.ceil(safeLimit * 0.2);
    const reviewLimit = userId ? Math.ceil(safeLimit * 0.25) : 0;

    const [collaborative, contentBased, trending, reviewBased] = await Promise.all([
      collaborativeLimit ? getCollaborativeRecommendations(userId, collaborativeLimit) : Promise.resolve([]),
      contentLimit ? getContentBasedRecommendations(productId, contentLimit) : Promise.resolve([]),
      getTrendingProducts(trendingLimit),
      reviewLimit ? getReviewBasedRecommendations(userId, reviewLimit) : Promise.resolve([]),
    ]);

    const recommendations = [
      ...collaborative,
      ...contentBased,
      ...trending,
      ...reviewBased,
    ];

    const uniqueRecommendations = Array.from(
      new Map(recommendations.map((item) => [productIdentity(item), item])).values()
    );

    if (!uniqueRecommendations.length) return getFallbackRecommendations(safeLimit);

    return uniqueRecommendations
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, safeLimit);
  } catch (error) {
    logger.error('Hybrid recommendation error:', { message: error.message, stack: error.stack });
    return getFallbackRecommendations(limit);
  }
}

async function getTrendingProducts(limit = 5) {
  try {
    const safeLimit = normalizeLimit(limit, 5);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentReviews = await Review.aggregate([
      { $match: { reviewDate: { $gte: thirtyDaysAgo }, isDeleted: { $ne: true } } },
      { $group: { _id: '$product', count: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
      { $sort: { count: -1, avgRating: -1 } },
      { $limit: safeLimit },
    ]);

    if (recentReviews.length) {
      const productIds = recentReviews.map((review) => review._id);
      const products = await Product.find({ _id: { $in: productIds }, ...ACTIVE_PRODUCT_FILTER })
        .select(PRODUCT_FIELDS)
        .lean();
      const reviewDataById = new Map(recentReviews.map((review) => [String(review._id), review]));

      return products.map((product) => {
        const reviewData = reviewDataById.get(productIdentity(product));
        return {
          ...product,
          score: reviewData ? reviewData.count * 10 + (reviewData.avgRating || 0) * 5 : 0,
          reason: 'Tendance du moment',
          strategy: 'trending',
        };
      });
    }

    const products = await Product.find(ACTIVE_PRODUCT_FILTER)
      .sort({ averageRating: -1, reviewCount: -1, isRecommended: -1 })
      .limit(safeLimit)
      .select(PRODUCT_FIELDS)
      .lean();

    return products.map((product) => ({
      ...product,
      score: (product.averageRating || 0) * 10 + (product.reviewCount || 0),
      reason: 'Les mieux notés',
      strategy: 'trending',
    }));
  } catch (error) {
    logger.error('Trending products error:', { message: error.message, stack: error.stack });
    return [];
  }
}

async function getReviewBasedRecommendations(userId, limit = 3) {
  try {
    if (!userId) return [];

    const safeLimit = normalizeLimit(limit, 3);
    const userReviews = await Review.find({ user: userId, rating: { $gte: 4 }, isDeleted: { $ne: true } })
      .select('product rating reviewDate')
      .lean();

    if (!userReviews.length) return [];

    const categoryScores = {};
    const reviewedProductIds = new Set();

    userReviews.forEach((review) => {
      if (review.product?._id || review.product) {
        reviewedProductIds.add(String(review.product._id || review.product));
      }
    });

    const preferredProducts = await Product.find({ _id: { $in: Array.from(reviewedProductIds) } })
      .select('category')
      .lean();

    preferredProducts.forEach((product) => {
      if (product.category) {
        categoryScores[product.category] = (categoryScores[product.category] || 0) + 1;
      }
    });

    const topCategory = Object.entries(categoryScores)
      .sort((a, b) => b[1] - a[1])[0]?.[0];

    if (!topCategory) return [];

    const recommendations = await Product.find({
      category: topCategory,
      _id: { $nin: Array.from(reviewedProductIds) },
      ...ACTIVE_PRODUCT_FILTER,
      averageRating: { $gte: 4 },
    })
      .sort({ averageRating: -1, reviewCount: -1 })
      .limit(safeLimit)
      .select(PRODUCT_FIELDS)
      .lean();

    return recommendations.map((product) => ({
      ...product,
      score: (product.averageRating || 0) * 10 + (product.reviewCount || 0),
      reason: 'Basé sur vos préférences',
      strategy: 'review-based',
    }));
  } catch (error) {
    logger.error('Review-based recommendation error:', { message: error.message, stack: error.stack });
    return [];
  }
}

async function getFallbackRecommendations(limit = 6) {
  try {
    const safeLimit = normalizeLimit(limit, 6);
    const products = await Product.find(ACTIVE_PRODUCT_FILTER)
      .sort({ isRecommended: -1, averageRating: -1, reviewCount: -1 })
      .limit(safeLimit)
      .select(PRODUCT_FIELDS)
      .lean();

    return products.map((product) => ({
      ...product,
      score: (product.averageRating || 0) * 10 + (product.reviewCount || 0),
      reason: 'Recommandé par Star Mousse',
      strategy: 'fallback',
    }));
  } catch (error) {
    logger.error('Fallback recommendation error:', { message: error.message, stack: error.stack });
    return [];
  }
}

async function trackRecommendationClick(userId, productId, strategy, sessionId, metadata = {}) {
  try {
    if (!productId) return null;

    const event = await RecommendationEvent.create({
      userId,
      sessionId,
      strategy,
      productId,
      clicked: true,
      converted: Boolean(metadata.converted),
      score: metadata.score,
      reason: metadata.reason,
      metadata,
    });

    logger.info('Recommendation click tracked', {
      userId,
      productId,
      strategy,
      sessionId,
      eventId: event._id,
    });

    return event;
  } catch (error) {
    logger.error('Recommendation tracking error:', { message: error.message, stack: error.stack });
    return null;
  }
}

function calculateQualityScore(recommendations) {
  if (!Array.isArray(recommendations) || !recommendations.length) return 0;

  const avgRating = recommendations.reduce((sum, product) => sum + (product.averageRating || 0), 0) / recommendations.length;
  const avgReviews = recommendations.reduce((sum, product) => sum + (product.reviewCount || 0), 0) / recommendations.length;
  const diversity = new Set(recommendations.map((product) => product.category).filter(Boolean)).size;

  return (avgRating * 30) + (Math.min(avgReviews, 50) * 0.5) + (diversity * 10);
}

module.exports = {
  getCollaborativeRecommendations,
  getContentBasedRecommendations,
  getHybridRecommendations,
  getTrendingProducts,
  getReviewBasedRecommendations,
  getFallbackRecommendations,
  trackRecommendationClick,
  calculateQualityScore,
};
