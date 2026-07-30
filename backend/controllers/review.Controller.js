const Review = require('../models/review.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const mongoose = require('mongoose');

// Importation des services de traitement d'intelligence artificielle et de recommandation
const {
    processReviewSentimentInBackground,
    updateProductRecommendation
} = require('../services/sentimentRecommendation.service');
const { rebuildRecommendations: rebuildProductRecommendations } = require('../services/productRecommendation.service');

// ==========================================
// FONCTIONS UTILITAIRES Centralisées (DRY)
// ==========================================

// Nettoie et normalise les chaînes de caractères pour une correspondance textuelle fiable (Insensible aux accents/mots génériques)
const normalizeName = (value = '') =>
    String(value)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
        .replace(/\d{2,3}x\d{2,3}/g, '') // Filtre les dimensions (ex: 190x90)
        .replace(/matelas|oreiller|medical|orthopedique|ressort/g, '') // Supprime les mots-clés redondants de la marque
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

// Résout dynamiquement l'ID d'un produit à partir de son nom en cas d'achat sans ID (Fuzzy Matching)
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

// Validation unifiée de la note attribuée
const isValidRating = (rating) => Number.isInteger(rating) && rating >= 1 && rating <= 5;

// CENTRALISATION (Anti-Duplication) : Déclenche les calculs asynchrones post-modification d'avis
const triggerBackgroundJobs = (reviewId, productId) => {
    if (productId) {
        // Exécuté de manière asynchrone pour ne pas bloquer la réponse HTTP de l'utilisateur (Non-blocking I/O)
        updateProductRecommendation(productId).catch(err => 
            console.error(`[Job] Échec recalcul recommandations pour le produit ${productId}:`, err.message)
        );
    }
    processReviewSentimentInBackground(reviewId);
};

// ==========================================
// CONTRÔLEURS DES AVIS CLIENTS (REVIEWS)
// ==========================================

// Récupère la totalité des avis non supprimés (Espace Administration)
module.exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ isDeleted: { $ne: true } })
            .populate('user', 'username email')
            .populate('product', 'name price')
            .sort({ reviewDate: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupère uniquement les avis de l'utilisateur connecté (Espace Client sécurisé)
module.exports.getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id, isDeleted: { $ne: true } })
            .populate('product', 'name')
            .populate('order', 'orderNumber status')
            .sort({ reviewDate: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupère la fiche des avis spécifiques à un produit public
module.exports.getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Produit non trouvé.' });

        const reviews = await Review.find({ product: productId, isDeleted: { $ne: true } })
            .populate('user', 'username')
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

// Récupère un avis unique par son ID
module.exports.getReviewById = async (req, res) => {
    try {
        const reviewId = req.params.id || req.params.idReview;
        const review = await Review.findOne({ _id: reviewId, isDeleted: { $ne: true } })
            .populate('user', 'username')
            .populate('product', 'name');
            
        if (!review) return res.status(404).json({ message: 'Avis introuvable.' });
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Soumission d'un nouvel avis (Sécurisé par rapport aux commandes réelles de l'utilisateur)
module.exports.addReview = async (req, res) => {
    try {
        const rating = Number(req.body.rating);
        if (!isValidRating(rating)) {
            return res.status(400).json({ message: 'La note doit être un entier compris entre 1 et 5.' });
        }

        if (!req.body.order || !mongoose.isValidObjectId(req.body.order)) {
            return res.status(400).json({ message: 'Référence de commande invalide.' });
        }

        // Sécurité stricte : On s'assure que la commande appartient bien à l'utilisateur connecté
        const order = await Order.findOne({ _id: req.body.order, userId: req.user._id }).lean();
        if (!order) {
            return res.status(403).json({ message: 'Vous pouvez laisser un avis uniquement sur vos propres achats.' });
        }

        const orderProduct = (order.products || []).find((p) => (
            !req.body.productName || String(p.name || '').toLowerCase() === String(req.body.productName || '').toLowerCase()
        )) || (order.products || [])[0];

        const resolvedProduct = await resolveProduct(req.body);
        
        const newReview = new Review({
            rating,
            comment: String(req.body.comment || '').trim(),
            product: resolvedProduct?._id || req.body.product,
            productName: req.body.productName || resolvedProduct?.name || orderProduct?.name || 'Produit Star Mousse',
            order: order._id,
            user: req.user._id,
            sentimentStatus: 'pending'
        });

        await newReview.save();
        
        // Délégation des tâches lourdes en arrière-plan (Background Jobs unifiés)
        triggerBackgroundJobs(newReview._id, newReview.product);

        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mise à jour d'un avis existant avec réévaluation automatique du sentiment
module.exports.updateReview = async (req, res) => {
    try {
        const resolvedProduct = await resolveProduct(req.body);
        const rating = req.body.rating == null ? undefined : Number(req.body.rating);
        
        if (rating !== undefined && !isValidRating(rating)) {
            return res.status(400).json({ message: 'La note doit être un entier compris entre 1 et 5.' });
        }

        const updates = {
            ...req.body,
            ...(rating !== undefined ? { rating } : {}),
            ...(req.body.comment != null ? { comment: String(req.body.comment).trim() } : {}),
            ...(resolvedProduct ? { product: resolvedProduct._id, productName: req.body.productName || resolvedProduct.name } : {})
        };

        // Si le contenu critique change, l'analyse IA repasse à l'état 'pending'
        if (req.body.comment != null || rating !== undefined) {
            updates.sentimentStatus = 'pending';
        }

        const updatedReview = await Review.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!updatedReview) return res.status(404).json({ message: 'Avis introuvable.' });

        // Appel du helper centralisé
        triggerBackgroundJobs(updatedReview._id, updatedReview.product);

        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Suppression logique (Soft Delete) d'un avis
module.exports.deleteReview = async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        if (!deletedReview) return res.status(404).json({ message: 'Avis introuvable.' });

        if (deletedReview.product) {
            updateProductRecommendation(deletedReview.product).catch(() => null);
        }

        res.status(200).json({ message: 'Avis supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Recalcul global de la matrice de recommandation par l'administrateur
module.exports.rebuildRecommendations = async (req, res) => {
    try {
        const recommendations = await rebuildProductRecommendations();
        res.status(200).json({
            message: 'Recommendations reconstruites avec succès.',
            processed: recommendations.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};