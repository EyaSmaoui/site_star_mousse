const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, unique: true },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    sentimentScore: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    reason: String,
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recommendation', recommendationSchema, 'recommendations');
