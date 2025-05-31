const express = require('express');
const { auth } = require('../middleware/auth');
const Item = require('../models/Item');
const User = require('../models/User');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/items
// @desc    Get all items
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items' });
  }
});

// @route   GET /api/items/:id
// @desc    Get a single item
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item' });
  }
});

// @route   POST /api/items
// @desc    Create a new item
// @access  Private (Admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/items/:id
// @desc    Update an item
// @access  Private (Admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    Object.keys(req.body).forEach(key => {
      item[key] = req.body[key];
    });

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete an item
// @access  Private (Admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Delete the image file if it exists
    if (item.imageUrl && item.imageUrl.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', item.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await item.remove();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item' });
  }
});

// @route   GET /api/items/category/:category
// @desc    Get items by category
// @access  Private
router.get('/category/:category', auth, async (req, res) => {
  try {
    const items = await Item.find({
      category: req.params.category,
      isAvailable: true
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/items/upload
// @desc    Upload an image for an item
// @access  Private (Admin only)
router.post('/upload', auth, isAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message || 'Error uploading image' });
  }
});

module.exports = router; 