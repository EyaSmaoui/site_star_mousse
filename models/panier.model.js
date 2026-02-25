const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  cartId: { type: Number, unique: true },             // identifiant panier
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // lien vers utilisateur
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ],
  totalAmount: { type: Number, default: 0 },          // montant total
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);