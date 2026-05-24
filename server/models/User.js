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
  role: {
    type: String,
    enum: ['customer', 'supplier', 'admin'],
    required: true,
    default: 'customer'
  },
  supplierType: {
    type: String,
    enum: ['gas', 'water', null],
    default: null,
    required: function() {
      return this.role === 'supplier';
    }
  },
  location: {
    type: String
  },
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