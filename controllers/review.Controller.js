const Review = require('../models/review.model');

//get all reviews
module.exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('user').populate('product');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//get review by id
module.exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('user').populate('product');
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//create review
module.exports.addReview = async (req, res) => {
    try {
        const newreview = new Review(req.body);
        await newreview.save();
        res.status(201).json(newreview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//update review
module.exports.updateReview = async (req, res) => {
    try {
        const updatereview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatereview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(updatereview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//delete review
module.exports.deleteReview = async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);
        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};