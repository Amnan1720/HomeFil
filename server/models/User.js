const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

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

  password: {
    type: String,
    required: true
  },

  // Customer or Supplier or Admin
  role: {
    type: String,
    enum: ['customer', 'supplier', 'admin'],
    required: true,
    default: 'customer'
  },

  // Gas or Water (only for suppliers)
  supplierType: {
    type: String,
    enum: ['gas', 'water', null],
    default: null
  },

  // ✅ IMPROVEMENT 1: Supplier Status System
  supplierStatus: {
    type: String,
    enum: ['open', 'busy', 'offline', 'closed'],
    default: 'open'
  },

  // Location info
  location: {
    type: String
  },

  // ✅ IMPROVEMENT 2: Kenya County for filtering
  county: {
    type: String
  },

  // ✅ IMPROVEMENT 2: GPS coordinates for nearby search
  latitude: {
    type: Number
  },

  longitude: {
    type: Number
  },

  // Supplier approval status
  isApproved: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('User', UserSchema);