const axios = require('axios');
const Review = require('../models/review.model');
const Product = require('../models/product.model');

/**
 * Section 5.3.4 & 5.3.5 - Analyse de sentiment via BERT (Flask) et mise à jour de l'avis
 */
const processReviewSentiment = async (reviewId) => {
    try {
        const review = await Review.findById(reviewId);
        if (!review || !review.comment) return;

        // 1. Appel HTTP vers le microservice Python Flask (Port 5002)
        // C'est ici que s'applique le modèle "nlptown/bert-base-multilingual-uncased-sentiment"
        const response = await axios.post('http://localhost:5002/analyze', {
            commentaire: review.comment
        });

        const noteCalculeeIA = response.data.note; // Récupère la note (1 à 5) calculée par l'IA

        // 2. Met à jour l'avis avec la note générée automatiquement par l'IA
        review.rating = noteCalculeeIA;
        // Optionnel : si tu as un champ pour suivre le statut de l'IA dans ton schéma Mongoose
        review.sentimentStatus = 'completed'; 
        await review.save();

        // 3. Recalculer la moyenne globale du produit et mettre à jour les recommandations
        if (review.product) {
            await updateProductRecommendation(review.product);
        }

    } catch (error) {
        console.error(`[Sentiment Service] Erreur lors du traitement de la review ${reviewId}:`, error.message);
        
        // Sécurité : marquer l'état comme échoué si nécessaire
        await Review.findByIdAndUpdate(reviewId, { sentimentStatus: 'failed' }).catch(() => {});
    }
};

/**
 * Exécution asynchrone en arrière-plan pour ne pas bloquer l'expérience utilisateur (Section 5.3.6)
 */
const processReviewSentimentInBackground = (reviewId) => {
    // On lance la fonction sans "await" pour que Node.js réponde immédiatement au client
    processReviewSentiment(reviewId);
};

/**
 * Section 5.3.6 - Agrégation MongoDB, calcul de la note moyenne et mise en avant automatique
 */
const updateProductRecommendation = async (productId) => {
    try {
        // 1. Récupère tous les avis non supprimés liés à ce matelas
        const reviews = await Review.find({ product: productId, isDeleted: { $ne: true } });
        
        if (reviews.length === 0) {
            // S'il n'y a plus d'avis, on réinitialise les scores
            await Product.findByIdAndUpdate(productId, {
                note_coeur: 0,
                isRecommended: false,
                reviewCount: 0
            });
            return;
        }

        // 2. Calcule la moyenne géométrique/arithmétique des notes attribuées par l'IA
        const sommeNotes = reviews.reduce((sum, item) => sum + item.rating, 0);
        const nouvelleMoyenne = parseFloat((sommeNotes / reviews.length).toFixed(2));

        // 3. Logique de filtrage automatique (Note moyenne >= 4.0 / 5)
        // Si le matelas est populaire, il passe à "true" pour être poussé en Page d'Accueil
        const misEnAvant = nouvelleMoyenne >= 4.0;

        // 4. Enregistrement dans la collection "products"
        await Product.findByIdAndUpdate(productId, {
            note_coeur: nouvelleMoyenne,        // Ta variable personnalisée pour le rapport
            averageRating: nouvelleMoyenne,     // Synchro avec ton modèle actuel
            reviewCount: reviews.length,
            isRecommended: misEnAvant           // Filtre de ta vitrine dynamique
        });

        console.log(`[Recommandation] Matelas ${productId} mis à jour. Nouvelle moyenne : ${nouvelleMoyenne} (Recommandé: ${misEnAvant})`);

    } catch (error) {
        console.error(`[Recommandation Service] Erreur de recalcul pour le produit ${productId}:`, error.message);
    }
};

module.exports = {
    processReviewSentiment,
    processReviewSentimentInBackground,
    updateProductRecommendation
};