const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.Controller');
const { optionalAuthUser } = require('../middleware/authMiddlewares');

router.post('/create-session', optionalAuthUser, paymentController.createStripeSession);
router.post('/confirm-payment', optionalAuthUser, paymentController.confirmPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleStripeWebhook);

module.exports = router;
