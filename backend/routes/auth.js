const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Child = require('../models/Child');
const auth = require('../middleware/auth');
const router = express.Router();

// Generate JWT token
const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register User (General/Parent)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, age, userType } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password, age, userType });
    await user.save();

    const token = generateToken(user._id, userType);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, userType: user.userType }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    
    let user;
    if (userType === 'child') {
      user = await Child.findOne({ username: email });
      if (user && user.isPaused) {
        return res.status(401).json({ message: 'Account is paused by parent' });
      }
    } else {
      user = await User.findOne({ email, userType });
    }

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, userType);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email || user.username, userType }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      userType: req.userType
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, gender, age, phoneNumber } = req.body;
    
    let Model = req.userType === 'child' ? Child : User;
    const user = await Model.findByIdAndUpdate(
      req.user._id,
      { name, gender, age, phoneNumber },
      { new: true }
    );

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      userType: req.userType
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change Password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!(await req.user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    let Model = req.userType === 'child' ? Child : User;
    const user = await Model.findById(req.user._id);
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;