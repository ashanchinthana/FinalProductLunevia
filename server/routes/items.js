const express = require('express');
const { auth } = require('../middleware/auth');
const Item = require('../models/Item');
const User = require('../models/User');

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
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
    const items = await Item.find({ isAvailable: true });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/items
// @desc    Create a new item
// @access  Private (Admin only)
router.post('/', [auth, isAdmin], async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, stock } = req.body;

    const newItem = new Item({
      name,
      description,
      price,
      category,
      imageUrl,
      stock,
      createdBy: req.user.id
    });

    const item = await newItem.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error creating item' });
  }
});

// @route   PUT /api/items/:id
// @desc    Update an item
// @access  Private (Admin only)
router.put('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, stock, isAvailable } = req.body;
    
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Update fields
    if (name) item.name = name;
    if (description) item.description = description;
    if (price) item.price = price;
    if (category) item.category = category;
    if (imageUrl) item.imageUrl = imageUrl;
    if (stock !== undefined) item.stock = stock;
    if (isAvailable !== undefined) item.isAvailable = isAvailable;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating item' });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete an item
// @access  Private (Admin only)
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await item.remove();
    res.json({ message: 'Item removed' });
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

module.exports = router; 