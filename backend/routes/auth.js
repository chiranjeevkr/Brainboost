const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, mode } = req.body;
    
    const existingUser = await User.findOne({ username, email, mode });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this mode' });
    }

    const user = new User({
      username,
      email,
      mode
    });

    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ token, user: { id: user._id, username, email, mode } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, email, mode } = req.body;
    
    const user = await User.findOne({ username, email, mode });
    if (!user) {
      return res.status(400).json({ message: 'User not found. Please register first.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, username, email, mode } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;