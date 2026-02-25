const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.Controller');

// Routes pour les avis
router.get('/getAllReviews', reviewController.getAllReviews);
router.get('/:idReview', reviewController.getReviewById);
router.post('/addReview', reviewController.addReview);
router.put('/updateReview/:id', reviewController.updateReview);
router.delete('/deleteReview/:id', reviewController.deleteReview);
module.exports = router;