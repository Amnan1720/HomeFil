const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role, supplierType, location } = req.body;

    // Check existing email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Validate supplierType for suppliers
    if (role === 'supplier' && !supplierType) {
      return res.status(400).json({ message: 'Please select what you sell (Gas or Water)' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const status = role === 'supplier' ? 'pending' : 'approved';
    const isApproved = role === 'supplier' ? false : true;

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      supplierType: role === 'supplier' ? supplierType : null,
      location,
      status,
      isApproved
    });

    await user.save();

    res.status(201).json({
      message: role === 'supplier'
        ? 'Account created! Wait for admin approval before you can post listings.'
        : 'Account created successfully'
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Block unapproved suppliers
    if (user.role === 'supplier' && !user.isApproved) {
      return res.status(403).json({ message: 'Your account is pending admin approval' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
        supplierType: user.supplierType
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        supplierType: user.supplierType,
        location: user.location,
        email: user.email,
        phone: user.phone,
        isApproved: user.isApproved
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/create-admin
router.get('/create-admin', async (req, res) => {
  try {
    const existing = await User.findOne({ role: 'admin' });
    if (existing) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    const hashedPassword = await bcrypt.hash('admin1234', 10);
    const admin = new User({
      name: 'Admin',
      email: 'admin@homefil.com',
      phone: '0700000000',
      password: hashedPassword,
      role: 'admin',
      status: 'approved',
      isApproved: true
    });
    await admin.save();
    res.json({
      message: 'Admin created!',
      email: 'admin@homefil.com',
      password: 'admin1234'
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;