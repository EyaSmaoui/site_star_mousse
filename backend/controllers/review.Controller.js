const Review = require('../models/review.model');
const Product = require('../models/product.model');
const mongoose = require('mongoose');
const {
    processReviewSentiment,
    processReviewSentimentInBackground,
    updateProductRecommendation
} = require('../services/sentimentRecommendation.service');

const normalizeName = (value = '') =>
    String(value)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\d{2,3}x\d{2,3}/g, '')
        .replace(/matelas|oreiller|medical|orthopedique|ressort/g, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const resolveProduct = async ({ product, productName }) => {
    if (product && mongoose.isValidObjectId(product)) {
        const found = await Product.findById(product);
        if (found) return found;
    }

    if (!productName) return null;

    const products = await Product.find();
    const normalizedTarget = normalizeName(productName);
    return products.find((item) => {
        const normalizedProduct = normalizeName(item.name);
        return normalizedProduct === normalizedTarget ||
            normalizedTarget.includes(normalizedProduct) ||
            normalizedProduct.includes(normalizedTarget);
    }) || null;
};

module.exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ isDeleted: { $ne: true } })
            .populate('user')
            .populate('product')
            .populate('order')
            .sort({ reviewDate: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            user: req.user._id,
            isDeleted: { $ne: true }
        })
            .populate('product')
            .populate('order')
            .sort({ reviewDate: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const reviews = await Review.find({
            product: productId,
            isDeleted: { $ne: true }
        })
            .populate('user', 'username name email')
            .sort({ reviewDate: -1 });

        res.status(200).json({
            product: {
                _id: product._id,
                name: product.name,
                averageRating: product.averageRating || 0,
                reviewCount: product.reviewCount || reviews.length
            },
            reviews
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getReviewById = async (req, res) => {
    try {
        const reviewId = req.params.id || req.params.idReview;
        const review = await Review.findOne({ _id: reviewId, isDeleted: { $ne: true } })
            .populate('user')
            .populate('product')
            .populate('order');
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.addReview = async (req, res) => {
    try {
        const rating = Number(req.body.rating);
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'La note doit etre comprise entre 1 et 5.' });
        }

        const resolvedProduct = await resolveProduct(req.body);
        const newReview = new Review({
            rating,
            comment: String(req.body.comment || '').trim(),
            product: resolvedProduct?._id || req.body.product,
            productName: req.body.productName || resolvedProduct?.name,
            order: req.body.order,
            user: req.user?._id || req.body.user,
            owner: req.user?._id || req.body.owner
        });

        await newReview.save();
        processReviewSentimentInBackground(newReview._id);
        res.status(201).json({
            ...newReview.toObject(),
            sentimentStatus: 'pending'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.updateReview = async (req, res) => {
    try {
        const resolvedProduct = await resolveProduct(req.body);
        const rating = req.body.rating == null ? undefined : Number(req.body.rating);
        if (rating !== undefined && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
            return res.status(400).json({ message: 'La note doit etre comprise entre 1 et 5.' });
        }

        const updates = {
            ...req.body,
            ...(rating !== undefined ? { rating } : {}),
            ...(req.body.comment != null ? { comment: String(req.body.comment).trim() } : {}),
            ...(resolvedProduct ? { product: resolvedProduct._id, productName: req.body.productName || resolvedProduct.name } : {})
        };
        const updatedReview = await Review.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        processReviewSentimentInBackground(updatedReview._id);
        res.status(200).json({
            ...updatedReview.toObject(),
            sentimentStatus: 'pending'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.deleteReview = async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }

        try {
            if (deletedReview.product) {
                await updateProductRecommendation(deletedReview.product);
            }
        } catch (recalcError) {
            console.error('[Review] Failed to recalculate recommendations after delete:', recalcError.message);
        }

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.rebuildRecommendations = async (req, res) => {
    try {
        const reviews = await Review.find({ isDeleted: { $ne: true } });
        let processed = 0;

        for (const review of reviews) {
            if (review.product) {
                await processReviewSentiment(review._id);
                processed += 1;
            }
        }

        res.status(200).json({
            message: 'Recommendations rebuilt successfully',
            processed
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
