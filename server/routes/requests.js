const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const authMiddleware = require('../middleware/auth');

router.get('/requests', authMiddleware, async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/requests', authMiddleware, async (req, res) => {
  try {
    const { category, requestText, location } = req.body;
    const request = new Request({
      userId: req.user.id,
      category,
      requestText,
      location
    });
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;