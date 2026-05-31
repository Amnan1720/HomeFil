const express    = require('express');
const router     = express.Router();
const Listing    = require('../models/Listing');
const authMiddleware = require('../middleware/auth');
const upload     = require('../middleware/upload');

// ─────────────────────────────────────────
// HELPER: Calculate distance between two GPS points (in km)
// Uses Haversine formula
// ─────────────────────────────────────────
function calcDistance(lat1, lon1, lat2, lon2) {
  var R    = 6371; // Earth radius in km
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ─────────────────────────────────────────
// GET /api/listings
// ✅ IMPROVEMENT 2: Real search with geolocation + county filter
// ─────────────────────────────────────────
router.get('/listings', async (req, res) => {
  try {
    var { category, serviceType, location, county, lat, lng, radius, sort } = req.query;

    // Build filter object
    var filter = {};
    if (category)    filter.category    = category;
    if (serviceType) filter.serviceType = serviceType;
    if (county)      filter.county      = new RegExp(county, 'i');
    if (location)    filter.location    = new RegExp(location, 'i');

    // Get listings and also get supplier details (name, phone, status)
    var listings = await Listing.find(filter)
      .populate('supplierId', 'name phone supplierStatus supplierType isApproved')
      .sort({ createdAt: -1 });

    // ✅ If user sent their GPS, calculate distance to each listing
    if (lat && lng) {
      var userLat   = parseFloat(lat);
      var userLng   = parseFloat(lng);
      var maxRadius = parseFloat(radius) || 50; // default 50km

      listings = listings.filter(function(l) {
        // If listing has GPS, calculate distance
        if (l.latitude && l.longitude) {
          var dist = calcDistance(userLat, userLng, l.latitude, l.longitude);
          l._distance = dist;
          return dist <= maxRadius;
        }
        // If listing has no GPS, include it anyway
        return true;
      });

      // Sort by distance if requested
      if (sort === 'distance') {
        listings.sort(function(a, b) {
          return (a._distance || 9999) - (b._distance || 9999);
        });
      }
    }

    // Format response — add distance field if available
    var result = listings.map(function(l) {
      var obj = l.toObject();
      if (l._distance !== undefined) {
        obj.distance = Math.round(l._distance * 10) / 10; // e.g. 2.4
      }
      return obj;
    });

    res.json(result);

  } catch (err) {
    console.error('GET /listings error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────
// GET /api/listings/my
// Suppliers can only see their own listings
// ─────────────────────────────────────────
router.get('/listings/my', authMiddleware, async (req, res) => {
  try {
    var filter = { supplierId: req.user.id };

    // Supplier only sees their own category (gas or water)
    if (req.user.role === 'supplier' && req.user.supplierType) {
      filter.category = req.user.supplierType;
    }

    var listings = await Listing.find(filter).sort({ createdAt: -1 });
    res.json(listings);

  } catch (err) {
    console.error('GET /listings/my error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────
// POST /api/listings — Create new listing
// ─────────────────────────────────────────
router.post('/listings', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    // Only suppliers can create listings
    if (req.user.role !== 'supplier') {
      return res.status(403).json({ message: 'Only suppliers can create listings' });
    }

    var imageFiles = req.files ? req.files.map(function(f) { return f.filename; }) : [];
    var mainImage  = imageFiles.length > 0 ? imageFiles[0] : null;

    // ✅ IMPROVEMENT 3: Force category to match supplier type (security)
    var category = req.user.supplierType || req.body.category;

    var listing = new Listing({
      supplierId:        req.user.id,
      category:          category,
      serviceType:       req.body.serviceType,
      productType:       req.body.productType,
      price:             req.body.price,
      location:          req.body.location,
      county:            req.body.county,
      latitude:          req.body.latitude,
      longitude:         req.body.longitude,
      phone:             req.body.phone,
      whatsapp:          req.body.whatsapp,
      deliveryAvailable: req.body.deliveryAvailable === 'true',
      deliveryTime:      req.body.deliveryTime,
      status:            req.body.status || 'available',
      images:            imageFiles,
      image:             mainImage
    });

    await listing.save();
    res.status(201).json(listing);

  } catch (err) {
    console.error('POST /listings error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────
// PUT /api/listings/:id — Edit listing
// ✅ IMPROVEMENT 3: Backend verifies that supplier owns this listing
// ─────────────────────────────────────────
router.put('/listings/:id', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    var listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // ✅ SECURITY CHECK: Only the owner can edit
    if (listing.supplierId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not allowed to edit this listing' });
    }

    // Keep old images if no new ones uploaded
    var imageFiles = req.files && req.files.length > 0
      ? req.files.map(function(f) { return f.filename; })
      : listing.images;

    var mainImage = imageFiles.length > 0 ? imageFiles[0] : listing.image;

    // ✅ SECURITY: Force category to match supplier type
    var category = req.user.supplierType || req.body.category;

    var updated = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        category:          category,
        serviceType:       req.body.serviceType,
        productType:       req.body.productType,
        price:             req.body.price,
        location:          req.body.location,
        county:            req.body.county,
        latitude:          req.body.latitude,
        longitude:         req.body.longitude,
        phone:             req.body.phone,
        whatsapp:          req.body.whatsapp,
        deliveryAvailable: req.body.deliveryAvailable === 'true',
        deliveryTime:      req.body.deliveryTime,
        status:            req.body.status,
        images:            imageFiles,
        image:             mainImage
      },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    console.error('PUT /listings error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────
// DELETE /api/listings/:id — Delete listing
// ✅ IMPROVEMENT 3: Backend verifies that supplier owns this listing
// ─────────────────────────────────────────
router.delete('/listings/:id', authMiddleware, async (req, res) => {
  try {
    var listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // ✅ SECURITY CHECK: Only the owner can delete
    if (listing.supplierId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not allowed to delete this listing' });
    }

    await listing.deleteOne();
    res.json({ message: 'Listing deleted successfully' });

  } catch (err) {
    console.error('DELETE /listings error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;