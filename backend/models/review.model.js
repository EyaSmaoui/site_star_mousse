const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewDate: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    sentiment: {
        rating: { type: Number, min: 1, max: 5 },
        score: Number,
        label: String,
        source: { type: String, enum: ['bert', 'manual-rating', 'none'], default: 'none' },
        analyzedAt: Date
    },
    sentimentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

reviewSchema.index({ user: 1, reviewDate: -1 });
reviewSchema.index({ order: 1, user: 1 });
reviewSchema.index({ product: 1, reviewDate: -1 });

module.exports = mongoose.model('Review', reviewSchema, 'reviews_v2');
