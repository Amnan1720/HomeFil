const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/listings
router.get('/listings', async (req, res) => {
  try {
    const { category, serviceType, location } = req.query;
    const filter = {};
    if (category)    filter.category = category;
    if (serviceType) filter.serviceType = serviceType;
    if (location)    filter.location = new RegExp(location, 'i');
    const listings = await Listing.find(filter).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/listings — with multiple image upload
router.post('/listings', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    if (req.user.role !== 'supplier') {
      return res.status(403).json({ message: 'Only suppliers can create listings' });
    }

    // Get all uploaded image filenames
    const imageFiles = req.files ? req.files.map(f => f.filename) : [];
    const mainImage = imageFiles.length > 0 ? imageFiles[0] : null;

    const listing = new Listing({
      ...req.body,
      supplierId: req.user.id,
      images: imageFiles,
      image: mainImage,
      deliveryAvailable: req.body.deliveryAvailable === 'true'
    });

    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/listings/:id — with multiple image upload
router.put('/listings/:id', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    if (listing.supplierId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // If new images uploaded use them otherwise keep old ones
    const imageFiles = req.files && req.files.length > 0
      ? req.files.map(f => f.filename)
      : listing.images;
    const mainImage = imageFiles.length > 0 ? imageFiles[0] : listing.image;

    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images: imageFiles,
        image: mainImage,
        deliveryAvailable: req.body.deliveryAvailable === 'true'
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/listings/:id
router.delete('/listings/:id', authMiddleware, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    if (listing.supplierId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await listing.deleteOne();
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;