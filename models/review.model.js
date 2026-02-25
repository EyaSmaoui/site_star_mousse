const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    rating: { type: Number, required: true, min: 1, max: 5 }, // note de 1 à 5
    comment: String,                          // commentaire optionnel
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // référence au produit
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },       // référence à l'utilisateur
    reviewDate: { type: Date, default: Date.now }, // date de la revue
});

module.exports = mongoose.model('Review', reviewSchema, 'reviews_v2');