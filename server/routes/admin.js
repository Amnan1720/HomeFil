const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Listing = require('../models/Listing');
const Request = require('../models/Request');
const authMiddleware = require('../middleware/auth');

// Check if user is admin
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
}

// GET /api/admin/stats
router.get('/admin/stats', authMiddleware, adminOnly, async (req, res) => {
  try {
    const totalUsers       = await User.countDocuments({ role: 'customer' });
    const totalSuppliers   = await User.countDocuments({ role: 'supplier' });
    const totalListings    = await Listing.countDocuments();
    const totalRequests    = await Request.countDocuments();
    const pendingSuppliers = await User.countDocuments({
      role: 'supplier', status: 'pending'
    });

    res.json({
      totalUsers,
      totalSuppliers,
      totalListings,
      totalRequests,
      pendingSuppliers
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/admin/suppliers
router.get('/admin/suppliers', authMiddleware, adminOnly, async (req, res) => {
  try {
    const suppliers = await User.find({ role: 'supplier' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/admin/customers
router.get('/admin/customers', authMiddleware, adminOnly, async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/admin/suppliers/:id/approve
router.put('/admin/suppliers/:id/approve', authMiddleware, adminOnly, async (req, res) => {
  try {
    const supplier = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', isApproved: true },
      { new: true }
    );
    res.json({ message: 'Supplier approved', supplier });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/admin/suppliers/:id/reject
router.put('/admin/suppliers/:id/reject', authMiddleware, adminOnly, async (req, res) => {
  try {
    const supplier = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', isApproved: false },
      { new: true }
    );
    res.json({ message: 'Supplier rejected', supplier });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/admin/users/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/admin/listings
router.get('/admin/listings', authMiddleware, adminOnly, async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate('supplierId', 'name phone email')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/admin/listings/:id
router.delete('/admin/listings/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/admin/requests
router.get('/admin/requests', authMiddleware, adminOnly, async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;