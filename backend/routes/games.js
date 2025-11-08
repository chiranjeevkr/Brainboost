const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const axios = require('axios');
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

// Generate AI puzzle using Gemini
router.post('/puzzle', auth, async (req, res) => {
  try {
    const { difficulty } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'AI API key not configured' });
    }

    const prompts = {
      easy: 'Generate a simple brain teaser or logic puzzle suitable for beginners. Include the question and answer in JSON format: {"question": "...", "answer": "..."}',
      medium: 'Generate a moderate difficulty brain teaser, logic puzzle, or math problem. Include the question and answer in JSON format: {"question": "...", "answer": "..."}',
      hard: 'Generate a challenging brain teaser, complex logic puzzle, or advanced math problem. Include the question and answer in JSON format: {"question": "...", "answer": "..."}'
    };

    const prompt = prompts[difficulty] || prompts.easy;
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const data = response.data;
    const aiText = data.candidates[0].content.parts[0].text;
    
    const jsonMatch = aiText.match(/\{[^}]+\}/);
    if (jsonMatch) {
      const puzzle = JSON.parse(jsonMatch[0]);
      res.json(puzzle);
    } else {
      res.json({ question: aiText.split('Answer:')[0].trim(), answer: aiText.split('Answer:')[1]?.trim() || 'Check solution' });
    }
  } catch (error) {
    console.error('AI Puzzle Error:', error);
    res.json({ question: "What comes next: 2, 4, 6, ?", answer: "8" });
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