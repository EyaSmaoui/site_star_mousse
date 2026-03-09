const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: Number, unique: true },              // identifiant commande
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // client
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ],
  total: { type: Number, required: true },        // montant total
  status: { type: String, default: 'Pending' },         // statut (Pending, Paid, Shipped, Delivered, Cancelled)
  createdAt: { type: Date, default: Date.now },
  //one to one
  owner : { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  
});

module.exports = mongoose.model('Order', orderSchema);