const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },       // nom de la catégorie
  description: String,                          // description optionnelle
  isActive: { type: Boolean, default: true }    // statut actif/inactif
});

module.exports = mongoose.model('Category', categorySchema);