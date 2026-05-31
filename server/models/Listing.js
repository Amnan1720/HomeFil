const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({

  // Who posted this listing
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Gas or Water
  category: {
    type: String,
    enum: ['water', 'gas'],
    required: true
  },

  // Refill or Buy
  serviceType: {
    type: String,
    enum: ['refill', 'buy'],
    required: true
  },

  // Product name e.g. "20L drinking water"
  productType: {
    type: String
  },

  price: {
    type: Number,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  // ✅ IMPROVEMENT 2: County for Kenya county filter
  county: {
    type: String
  },

  // ✅ IMPROVEMENT 2: GPS coordinates for distance calculation
  latitude: {
    type: Number
  },

  longitude: {
    type: Number
  },

  phone: {
    type: String,
    required: true
  },

  whatsapp: {
    type: String
  },

  deliveryAvailable: {
    type: Boolean,
    default: false
  },

  deliveryTime: {
    type: String
  },

  // Available or Out of stock
  status: {
    type: String,
    enum: ['available', 'out_of_stock'],
    default: 'available'
  },

  // Multiple images
  images: [{
    type: String
  }],

  // First image (main image)
  image: {
    type: String,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

// Text search index for location and product type
ListingSchema.index({
  location: 'text',
  county: 'text',
  productType: 'text'
});

module.exports = mongoose.model('Listing', ListingSchema);