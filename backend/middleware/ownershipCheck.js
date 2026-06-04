// Ownership verification middleware
const Review = require('../models/review.model');
const Cart = require('../models/panier.model');
const Order = require('../models/order.model');
const mongoose = require('mongoose');

// Check if user owns the review
exports.verifyReviewOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de review invalide' });
    }

    const review = await Review.findById(id);
    
    if (!review) {
      return res.status(404).json({ error: 'Review non trouvée' });
    }

    // Allow if user is review owner or admin
    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Vous n\'avez pas la permission de modifier cette review' 
      });
    }

    req.resource = review;
    next();
  } catch (error) {
    console.error('Erreur de vérification de propriété (review):', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Check if user owns the cart
exports.verifyCartOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de panier invalide' });
    }

    const cart = await Cart.findById(id);
    
    if (!cart) {
      return res.status(404).json({ error: 'Panier non trouvé' });
    }

    // Allow if user is cart owner or admin
    if (cart.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Vous n\'avez pas la permission de modifier ce panier' 
      });
    }

    req.resource = cart;
    next();
  } catch (error) {
    console.error('Erreur de vérification de propriété (cart):', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Check if user owns the order
exports.verifyOrderOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de commande invalide' });
    }

    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    // Allow if user is order owner, employee/manager, or admin
    if (order.userId?.toString() !== req.user.id && 
        !['admin', 'manager', 'employee', 'employeur'].includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Vous n\'avez pas la permission d\'accéder à cette commande' 
      });
    }

    req.resource = order;
    next();
  } catch (error) {
    console.error('Erreur de vérification de propriété (order):', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = exports;
