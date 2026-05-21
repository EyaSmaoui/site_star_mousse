const express = require('express');
const router = express.Router();
const adminRoutes = require('./admin.routes');
const userRoutes = require('./users.routes');
const reviewRoutes = require('./review.routes');
// const productRoutes = require('./product.routes');

router.get('/', (req, res) => res.json('Bienvenue sur l\'API Star Mousse'));

// Préfixage
router.use('/admin', adminRoutes);

// Préfixage
router.use('/users', userRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;