const mongoose = require('mongoose');

const recommendationEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  sessionId: { type: String, index: true },
  strategy: {
    type: String,
    enum: ['collaborative', 'content-based', 'trending', 'review-based', 'hybrid', 'fallback'],
    index: true,
  },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true },
  clicked: { type: Boolean, default: false, index: true },
  converted: { type: Boolean, default: false, index: true },
  score: Number,
  reason: String,
  metadata: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

recommendationEventSchema.index({ userId: 1, createdAt: -1 });
recommendationEventSchema.index({ sessionId: 1, createdAt: -1 });
recommendationEventSchema.index({ strategy: 1, clicked: 1, createdAt: -1 });

module.exports = mongoose.model('RecommendationEvent', recommendationEventSchema);
