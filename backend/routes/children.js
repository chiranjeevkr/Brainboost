const express = require('express');
const Child = require('../models/Child');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Create child account (Parent only)
router.post('/create', auth, async (req, res) => {
  try {
    if (req.userType !== 'parent') {
      return res.status(403).json({ message: 'Only parents can create child accounts' });
    }

    const { name, username, password, age, gender } = req.body;
    
    const existingChild = await Child.findOne({ username });
    if (existingChild) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const child = new Child({
      name,
      username,
      email: `${username}@child.local`,
      password,
      age,
      gender,
      parent: req.user._id
    });

    await child.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { children: child._id }
    });

    res.status(201).json({
      message: 'Child account created successfully',
      child: { id: child._id, name: child.name, username: child.username }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get parent's children
router.get('/', auth, async (req, res) => {
  try {
    if (req.userType !== 'parent') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const children = await Child.find({ parent: req.user._id });
    res.json(children);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete child account (with captcha)
router.delete('/:childId', auth, async (req, res) => {
  try {
    if (req.userType !== 'parent') {
      return res.status(403).json({ message: 'Only parents can delete child accounts' });
    }

    const { captcha } = req.body;
    if (captcha !== 'DELETE') {
      return res.status(400).json({ message: 'Invalid captcha' });
    }

    const child = await Child.findOneAndDelete({
      _id: req.params.childId,
      parent: req.user._id
    });

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { children: req.params.childId }
    });

    res.json({ message: 'Child account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update child profile
router.put('/:childId', auth, async (req, res) => {
  try {
    if (req.userType !== 'parent') {
      return res.status(403).json({ message: 'Only parents can update child profiles' });
    }

    const { name, age, gender } = req.body;
    const child = await Child.findOneAndUpdate(
      { _id: req.params.childId, parent: req.user._id },
      { name, age, gender },
      { new: true }
    );

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    res.json({ message: 'Child profile updated successfully', child });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Pause/Unpause child account
router.put('/:childId/status', auth, async (req, res) => {
  try {
    if (req.userType !== 'parent') {
      return res.status(403).json({ message: 'Only parents can manage child accounts' });
    }

    const { captcha, isPaused } = req.body;
    if (captcha !== 'PAUSE') {
      return res.status(400).json({ message: 'Invalid captcha' });
    }

    const child = await Child.findOneAndUpdate(
      { _id: req.params.childId, parent: req.user._id },
      { isPaused },
      { new: true }
    );

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    res.json({ message: `Child account ${isPaused ? 'paused' : 'activated'} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;