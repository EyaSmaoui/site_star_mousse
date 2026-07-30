const mongoose = require('mongoose');

const deliveryZoneSchema = new mongoose.Schema({
  region: {
    type: String,
    required: true,
    unique: true,
    enum: [
      'Tunis',
      'Ariana',
      'Ben Arous',
      'Manouba',
      'Nabeul',
      'Sousse',
      'Monastir',
      'Mahdia',
      'Sfax',
      'Gabes',
      'Medenine',
      'Tataouine',
      'Gafsa',
      'Tozeur',
      'Kebili',
      'Sidi Bouzid',
      'Kairouan',
      'Kasserine',
      'Jendouba',
      'Le Kef',
      'Siliana',
      'Bizerte',
    ],
    index: true,
  },
  shippingCost: {
    type: Number,
    required: true,
    min: 0,
  },
  estimatedDays: {
    type: Number,
    default: 2,
    min: 1,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('DeliveryZone', deliveryZoneSchema);
