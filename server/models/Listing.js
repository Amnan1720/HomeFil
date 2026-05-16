const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  supplierId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category:          { type: String, enum: ['water', 'gas'], required: true },
  serviceType:       { type: String, enum: ['refill', 'buy'], required: true },
  productType:       { type: String },
  price:             { type: Number, required: true },
  location:          { type: String, required: true },
  phone:             { type: String, required: true },
  whatsapp:          { type: String },
  deliveryAvailable: { type: Boolean, default: false },
  deliveryTime:      { type: String },
  status:            { type: String, enum: ['available', 'out_of_stock'], default: 'available' },
  image:             { type: String, default: null }, // Image file name stored here
  createdAt:         { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', ListingSchema);
