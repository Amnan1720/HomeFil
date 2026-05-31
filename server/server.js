const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const dotenv    = require('dotenv');
const path      = require('path');

dotenv.config();

const app = express();

// ── Middleware ──
app.use(cors());
app.use(express.json());

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Database connection ──
mongoose.connect(process.env.MONGO_URI)
  .then(function() {
    console.log('✅ MongoDB connected successfully');
  })
  .catch(function(err) {
    console.error('❌ MongoDB connection failed:', err.message);
  });

// ── Routes ──
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/listings'));
app.use('/api', require('./routes/requests'));
app.use('/api', require('./routes/supplier'));

// Admin routes (if you have an admin.js)
try {
  app.use('/api', require('./routes/admin'));
} catch(e) {
  console.log('Admin routes not found, skipping');
}

// ── Global error handler ──
// Catches any unhandled errors and returns JSON instead of crashing
app.use(function(err, req, res, next) {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// ── Start server ──
var PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
  console.log('🚀 HomeFil server running on port ' + PORT);
});