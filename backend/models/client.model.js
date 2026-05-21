const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  orders: {
    type: Number,
    default: 0
  },
  total: {
    type: String,
    default: "0 DT"
  },
  status: {
    type: String,
    enum: ["actif", "inactif"],
    default: "actif"
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

module.exports = mongoose.model('Client', clientSchema);