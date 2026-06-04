const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  customerName: {
    type: String,
    required: false,
    default: "Client"
  },
  customerEmail: {
    type: String,
    default: ""
    

  },
  phone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    trim: true

  },
  address: {
    type: String,
    required: true
  },
  products: [{
    name: String,
    quantity: { type: Number, default: 1 },
    dimension: String,
    price: Number
  }],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: "en attente",
    enum: ["en attente", "en cours", "expédié", "livré", "annulé"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

orderSchema.index({ createdAt: -1 });
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ customerEmail: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
