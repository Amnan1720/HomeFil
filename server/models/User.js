const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  phone:      { type: String, required: true },
  password:   { type: String, required: true },
  role:       { type: String, enum: ['customer', 'supplier', 'admin'], default: 'customer' },
  location:   { type: String },
  isApproved: { type: Boolean, default: false },
  status:     { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);