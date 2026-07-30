const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  sku: { type: String, unique: true, sparse: true },
  size: String,
  color: String,
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, default: 0, min: 0 },
  images: [String],
}, { _id: false });

const productSchema = new mongoose.Schema({
  productId: { type: String, index: true },
  name: { type: String, required: true },
  description: String,
  basePrice: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, index: true },
  stock: { type: Number, required: true, default: 0, min: 0 },
  warranty: Number,
  image: String,
  brand: { type: String, default: 'Star Mousse', index: true },
  images: [String],
  color: String,
  size: String,
  // Dimensions pour matelas/oreillers/lits
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, default: 'cm' },
  },
  weight: { type: Number, unit: 'kg' },
  // Variantes (taille, couleur, etc.)
  variants: [variantSchema],
  averageRating: { type: Number, default: 0, min: 0, max: 5, index: true },
  reviewCount: { type: Number, default: 0, min: 0, index: true },
  isRecommended: { type: Boolean, default: false, index: true },
  note_coeur: { type: Number, default: 0 },
  sentimentScore: { type: Number, default: 0 },
  recommendationRank: { type: Number, default: 0 },
  lastRecommendationUpdate: Date,
  isActive: { type: Boolean, default: true, required: true, index: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

productSchema.virtual('isAvctive').get(function getLegacyActiveFlag() {
  return this.isActive ?? true;
});

productSchema.index({ isActive: 1, category: 1, averageRating: -1, reviewCount: -1 });
productSchema.index({ isActive: 1, price: 1 });
productSchema.index({ isActive: 1, isRecommended: -1, averageRating: -1, reviewCount: -1 });
productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
