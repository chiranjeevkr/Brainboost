const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user progress
router.get('/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({
      gameProgress: user.gameProgress,
      totalScore: user.totalScore,
      iqScore: user.iqScore,
      badges: user.badges
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update game progress
router.post('/progress', auth, async (req, res) => {
  try {
    const { gameId, level, score } = req.body;
    const user = await User.findById(req.user.userId);
    
    const existingProgress = user.gameProgress.find(p => p.gameId === gameId);
    if (existingProgress) {
      existingProgress.level = Math.max(existingProgress.level, level);
      existingProgress.score = Math.max(existingProgress.score, score);
    } else {
      user.gameProgress.push({ gameId, level, score });
    }
    
    user.totalScore += score;
    await user.save();
    
    res.json({ message: 'Progress updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate AI puzzle
router.post('/puzzle', auth, async (req, res) => {
  try {
    const { difficulty } = req.body;
    
    // Simple puzzle generation (in real app, use AI API)
    const puzzles = {
      easy: [
        { question: "What comes next: 2, 4, 6, ?", answer: "8" },
        { question: "If you have 3 apples and eat 1, how many are left?", answer: "2" }
      ],
      medium: [
        { question: "What comes next: 1, 1, 2, 3, 5, ?", answer: "8" },
        { question: "A man is 4 times as old as his son. In 20 years, he will be twice as old. How old is the son now?", answer: "10" }
      ],
      hard: [
        { question: "What comes next: 2, 6, 12, 20, 30, ?", answer: "42" },
        { question: "You have 12 balls, one is heavier. Using a balance scale 3 times, how do you find it?", answer: "Divide into groups of 4" }
      ]
    };
    
    const puzzleSet = puzzles[difficulty] || puzzles.easy;
    const puzzle = puzzleSet[Math.floor(Math.random() * puzzleSet.length)];
    
    res.json(puzzle);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update IQ score
router.post('/iq', auth, async (req, res) => {
  try {
    const { score } = req.body;
    await User.findByIdAndUpdate(req.user.userId, { iqScore: score });
    res.json({ message: 'IQ score updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;