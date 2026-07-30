// Middleware de vérification de propriété (Qui a le droit de modifier quoi)
const Review = require('../models/review.model');
const Cart = require('../models/panier.model');
const Order = require('../models/order.model');
const mongoose = require('mongoose');

// [FL SITE] : SECTION AVIS / COMMENTAIRES DU SITE
// Vérifie si l'utilisateur est bien l'auteur de l'avis avant de l'autoriser à le MODIFIER ou à le SUPPRIMER.
// Un client lambda ne peut pas modifier l'avis d'un autre client (sauf s'il est Admin).
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

    // Sécurité : Bloque l'action (403) si le client connecté n'est pas le propriétaire de cet avis ET n'est pas Admin
    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Vous n\'avez pas la permission de modifier cette review' 
      });
    }

    req.resource = review;
    next(); // Autorise la modification ou suppression de l'avis
  } catch (error) {
    console.error('Erreur de vérification de propriété (review):', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// [FL SITE] : INTERFACE DU PANIER D'ACHAT (Cart)
// Assure la confidentialité des paniers. Empêche un utilisateur malveillant de modifier le contenu du panier 
// d'un autre client connecté en manipulant les requêtes HTTP.
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

    // Sécurité : Seul le propriétaire du panier ou l'administrateur a le droit de le modifier (ajouter/retirer des articles)
    if (cart.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Vous n\'avez pas la permission de modifier ce panier' 
      });
    }

    req.resource = cart;
    next(); // Autorise les modifications sur le panier
  } catch (error) {
    console.error('Erreur de vérification de propriété (cart):', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// [FL SITE] : ESPACE CLIENT ("Mes Commandes") ET BACK-OFFICE ADMIN
// Gère la confidentialité des factures et bons de commande. Un client peut voir uniquement SES propres commandes. 
// Le personnel de l'entreprise (Admin, Manager, Employé), lui, a l'autorisation d'y accéder pour préparer la livraison.
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

    // Sécurité : Bloque l'accès si ce n'est pas la commande du client connecté ET que l'utilisateur n'est pas un membre de l'équipe Star Mousse
    if (order.userId?.toString() !== req.user.id && 
        !['admin', 'manager', 'employee', 'employeur'].includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Vous n\'avez pas la permission d\'accéder à cette commande' 
      });
    }

    req.resource = order;
    next(); // Autorise l'affichage ou le traitement de la commande
  } catch (error) {
    console.error('Erreur de vérification de propriété (order):', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = exports;