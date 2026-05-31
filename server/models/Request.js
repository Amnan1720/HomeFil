const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category:    { type: String, enum: ['water', 'gas'], required: true },
  requestText: { type: String, required: true },
  location:    { type: String, required: true },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', RequestSchema);