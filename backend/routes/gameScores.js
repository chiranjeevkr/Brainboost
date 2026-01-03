const express = require('express');
const GameScore = require('../models/GameScore');
const auth = require('../middleware/auth');
const router = express.Router();

// Save game score
router.post('/save', auth, async (req, res) => {
  try {
    if (req.userType !== 'child') {
      return res.status(403).json({ message: 'Only children can save game scores' });
    }

    const { gameName, score, level } = req.body;
    
    const gameScore = new GameScore({
      child: req.user._id,
      gameName,
      score,
      level
    });

    await gameScore.save();
    res.status(201).json({ message: 'Score saved successfully', gameScore });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get child's scores
router.get('/my-scores', auth, async (req, res) => {
  try {
    if (req.userType !== 'child') {
      return res.status(403).json({ message: 'Only children can view their scores' });
    }

    const scores = await GameScore.find({ child: req.user._id }).sort({ playedAt: -1 });
    
    // Group by game and get best scores
    const bestScores = {};
    scores.forEach(score => {
      if (!bestScores[score.gameName] || score.level > bestScores[score.gameName].level) {
        bestScores[score.gameName] = score;
      }
    });

    res.json({ allScores: scores, bestScores: Object.values(bestScores) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get child's scores by parent
router.get('/child/:childId', auth, async (req, res) => {
  try {
    if (req.userType !== 'parent') {
      return res.status(403).json({ message: 'Only parents can view child scores' });
    }

    const Child = require('../models/Child');
    const child = await Child.findOne({ _id: req.params.childId, parent: req.user._id });
    
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    const scores = await GameScore.find({ child: req.params.childId }).sort({ playedAt: -1 });
    
    const bestScores = {};
    scores.forEach(score => {
      if (!bestScores[score.gameName] || score.level > bestScores[score.gameName].level) {
        bestScores[score.gameName] = score;
      }
    });

    res.json({ childName: child.name, allScores: scores, bestScores: Object.values(bestScores) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;