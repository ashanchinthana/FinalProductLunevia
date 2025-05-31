const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { auth } = require('../middleware/auth');

// Get admin dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Get total number of products
    const products = await Item.countDocuments();

    // For now, return static data for orders and revenue
    // In a real application, you would calculate these from your orders collection
    const stats = {
      products,
      orders: 0,
      revenue: 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

module.exports = router; 