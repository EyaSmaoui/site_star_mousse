const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'TND',
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'flouci', 'bank_transfer', 'cash_on_delivery'],
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
    index: true,
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  paymentDetails: {
    stripePaymentIntentId: String,
    flouciTransactionId: String,
    bankReference: String,
  },
  error: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  completedAt: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);
