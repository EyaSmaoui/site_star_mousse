const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  customerName: {
    type: String,
    default: 'Client',
  },
  customerEmail: {
    type: String,
    default: '',
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    trim: true,
    default: '',
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: 0,
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'flouci', 'bank_transfer', 'cash_on_delivery'],
    default: 'cash_on_delivery',
    index: true,
  },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: { type: Number, default: 1, min: 1 },
    dimension: String,
    price: { type: Number, default: 0, min: 0 },
  }],
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: { type: Number, default: 1, min: 1 },
    dimension: String,
    price: { type: Number, default: 0, min: 0 },
  }],
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    default: 'en attente',
    enum: ['en attente', 'en cours', 'expédié', 'livré', 'annulé'],
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.index({ createdAt: -1 });
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ customerEmail: 1, createdAt: -1 });
orderSchema.index({ 'products.product': 1, createdAt: -1 });
orderSchema.index({ 'items.product': 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
