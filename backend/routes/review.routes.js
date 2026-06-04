const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.Controller');
const { requireAuthUser, optionalAuthUser } = require('../middleware/authMiddlewares');
const { verifyReviewOwnership } = require('../middleware/ownershipCheck');

// Routes pour les avis
router.get('/getAllReviews', reviewController.getAllReviews);
router.get('/my-reviews', requireAuthUser, reviewController.getMyReviews);
router.get('/product/:productId', reviewController.getReviewsByProduct);
router.get('/:idReview', reviewController.getReviewById);
router.post('/addReview', requireAuthUser, reviewController.addReview);
router.post('/rebuild-recommendations', requireAuthUser, reviewController.rebuildRecommendations);
router.put('/updateReview/:id', requireAuthUser, verifyReviewOwnership, reviewController.updateReview);
router.delete('/deleteReview/:id', requireAuthUser, verifyReviewOwnership, reviewController.deleteReview);

module.exports = router;
