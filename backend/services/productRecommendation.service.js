const Product = require('../models/product.model');
const Review = require('../models/review.model');
const Recommendation = require('../models/recommendation.model');
const { withProductImage } = require('./productImages');

const DEFAULT_CATALOG_RATING = 4.2;
const MIN_CONFIDENCE_REVIEWS = 4;

const normalizeProductName = (value = '') =>
  String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\b\d{2,3}\s*[x*×]\s*\d{2,3}\b/g, '')
    .replace(/matelas|oreiller|medical|orthopedique|orthopedique|ressort/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getSentimentRating = (review) => {
  const directRating = Number(review.sentiment?.rating);
  if (directRating >= 1 && directRating <= 5) return directRating;

  const score = Number(review.sentiment?.score);
  if (Number.isFinite(score) && score > 0) {
    return clamp(score * 5, 1, 5);
  }

  return Number(review.rating || 0);
};

const buildReason = ({ averageRating, reviewCount, sentimentScore, stock }) => {
  if (reviewCount > 0 && averageRating >= 4.6 && sentimentScore >= 4.4) {
    return `${reviewCount} avis clients très positifs, note moyenne ${averageRating.toFixed(1)}/5.`;
  }

  if (reviewCount > 0 && averageRating >= 4) {
    return `${reviewCount} avis clients favorables, bon équilibre entre satisfaction et disponibilité.`;
  }

  if (Number(stock) > 0) {
    return 'Produit disponible, sélectionné comme alternative fiable du catalogue.';
  }

  return 'Sélection catalogue en attente de nouveaux avis clients.';
};

const scoreProduct = ({ product, reviews, catalogAverage }) => {
  const reviewCount = reviews.length;
  const averageRating = reviewCount
    ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviewCount
    : Number(product.averageRating || 0);

  const effectiveReviewCount = reviewCount || Number(product.reviewCount || 0);
  const effectiveAverage = effectiveReviewCount ? averageRating : DEFAULT_CATALOG_RATING;
  const sentimentScore = reviewCount
    ? reviews.reduce((sum, review) => sum + getSentimentRating(review), 0) / reviewCount
    : Number(product.sentimentScore || 0) || effectiveAverage;

  const bayesianRating =
    ((effectiveReviewCount * effectiveAverage) + (MIN_CONFIDENCE_REVIEWS * catalogAverage)) /
    (effectiveReviewCount + MIN_CONFIDENCE_REVIEWS);

  const stockBoost = Number(product.stock || 0) > 0 ? 0.18 : -0.45;
  const recommendedBoost = product.isRecommended ? 0.25 : 0;
  const sentimentBoost = (sentimentScore - 3) * 0.18;
  const rankBoost = Math.log1p(Number(product.recommendationRank || 0)) * 0.05;
  const score = bayesianRating + stockBoost + recommendedBoost + sentimentBoost + rankBoost;

  return {
    averageRating: Number(effectiveAverage.toFixed(2)),
    reviewCount: effectiveReviewCount,
    sentimentScore: Number(sentimentScore.toFixed(2)),
    rank: Number(score.toFixed(4)),
    reason: buildReason({
      averageRating: effectiveAverage,
      reviewCount: effectiveReviewCount,
      sentimentScore,
      stock: product.stock,
    }),
  };
};

const getProductRecommendations = async ({ limit = 6, query = '' } = {}) => {
  const maxLimit = Math.min(Math.max(Number(limit) || 6, 1), 24);
  const products = await Product.find({ isAvctive: { $ne: false } }).lean();
  if (!products.length) return [];

  const productIds = products.map((product) => product._id);
  const reviews = await Review.find({
    isDeleted: { $ne: true },
    product: { $in: productIds },
  }).lean();

  const reviewsByProduct = reviews.reduce((acc, review) => {
    const key = String(review.product);
    acc[key] = acc[key] || [];
    acc[key].push(review);
    return acc;
  }, {});

  const ratedReviews = reviews.filter((review) => Number(review.rating) > 0);
  const catalogAverage = ratedReviews.length
    ? ratedReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / ratedReviews.length
    : DEFAULT_CATALOG_RATING;

  const normalizedQuery = normalizeProductName(query);
  const scored = products
    .filter((product) => {
      if (!normalizedQuery) return true;
      const haystack = normalizeProductName(`${product.name} ${product.category} ${product.description}`);
      return normalizedQuery.split(/\s+/).every((token) => haystack.includes(token));
    })
    .map((product) => ({
      product,
      recommendation: scoreProduct({
        product,
        reviews: reviewsByProduct[String(product._id)] || [],
        catalogAverage,
      }),
    }))
    .sort((a, b) => {
      if (b.recommendation.rank !== a.recommendation.rank) {
        return b.recommendation.rank - a.recommendation.rank;
      }
      if (b.recommendation.reviewCount !== a.recommendation.reviewCount) {
        return b.recommendation.reviewCount - a.recommendation.reviewCount;
      }
      return Number(a.product.price || 0) - Number(b.product.price || 0);
    });

  const uniqueByBaseName = new Map();
  for (const item of scored) {
    const key = normalizeProductName(item.product.name) || String(item.product._id);
    const current = uniqueByBaseName.get(key);
    if (!current || item.recommendation.rank > current.recommendation.rank) {
      uniqueByBaseName.set(key, item);
    }
  }

  return Array.from(uniqueByBaseName.values())
    .slice(0, maxLimit)
    .map(({ product, recommendation }) => ({
      ...withProductImage(product),
      averageRating: recommendation.averageRating,
      reviewCount: recommendation.reviewCount,
      sentimentScore: recommendation.sentimentScore,
      recommendationRank: recommendation.rank,
      isRecommended: recommendation.reviewCount > 0 && recommendation.averageRating >= 4,
      recommendation,
    }));
};

const rebuildRecommendations = async () => {
  const recommendations = await getProductRecommendations({ limit: 24 });
  const bulk = recommendations.map((product) => ({
    updateOne: {
      filter: { product: product._id },
      update: {
        $set: {
          averageRating: product.recommendation.averageRating,
          reviewCount: product.recommendation.reviewCount,
          sentimentScore: product.recommendation.sentimentScore,
          rank: product.recommendation.rank,
          reason: product.recommendation.reason,
          updatedAt: new Date(),
        },
      },
      upsert: true,
    },
  }));

  if (bulk.length) {
    await Recommendation.bulkWrite(bulk);
  }

  await Promise.all(recommendations.map((product) =>
    Product.findByIdAndUpdate(product._id, {
      averageRating: product.recommendation.averageRating,
      reviewCount: product.recommendation.reviewCount,
      sentimentScore: product.recommendation.sentimentScore,
      recommendationRank: product.recommendation.rank,
      isRecommended: product.recommendation.reviewCount > 0 && product.recommendation.averageRating >= 4,
      note_coeur: product.recommendation.averageRating,
      lastRecommendationUpdate: new Date(),
    })
  ));

  return recommendations;
};

module.exports = {
  getProductRecommendations,
  rebuildRecommendations,
};
