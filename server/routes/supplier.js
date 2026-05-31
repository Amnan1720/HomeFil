const express  = require('express');
const router   = express.Router();
const User     = require('../models/User');
const authMiddleware = require('../middleware/auth');

// ─────────────────────────────────────────
// PUT /api/supplier/status
// Supplier updates their own status
// Status options: open | busy | offline | closed
// ─────────────────────────────────────────
router.put('/supplier/status', authMiddleware, async (req, res) => {
  try {

    // Only suppliers can update status
    if (req.user.role !== 'supplier') {
      return res.status(403).json({ message: 'Only suppliers can update status' });
    }

    var { supplierStatus } = req.body;

    // Make sure the status value is valid
    var allowedStatuses = ['open', 'busy', 'offline', 'closed'];
    if (!allowedStatuses.includes(supplierStatus)) {
      return res.status(400).json({
        message: 'Invalid status. Use: open, busy, offline, or closed'
      });
    }

    // Save to database
    var user = await User.findByIdAndUpdate(
      req.user.id,
      { supplierStatus: supplierStatus },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Status updated to ' + supplierStatus,
      supplierStatus: user.supplierStatus
    });

  } catch (err) {
    console.error('PUT /supplier/status error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────
// GET /api/supplier/status
// Get current supplier status
// ─────────────────────────────────────────
router.get('/supplier/status', authMiddleware, async (req, res) => {
  try {
    var user = await User.findById(req.user.id).select('supplierStatus');
    res.json({ supplierStatus: user.supplierStatus });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;