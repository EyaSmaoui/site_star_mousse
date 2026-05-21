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
    default: "client@starmousse.tn"
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  products: [{
    name: String,
    quantity: { type: Number, default: 1 },
    price: Number
  }],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: "en attente",
    enum: ["Pending", "en attente", "en cours", "expédié", "livré", "annulé"]
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

module.exports = mongoose.model('Order', orderSchema);
