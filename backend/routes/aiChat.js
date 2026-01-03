const express = require('express');
const auth = require('../middleware/auth');
const Child = require('../models/Child');
const router = express.Router();

// Chat with AI
router.post('/chat', auth, async (req, res) => {
  try {
    if (req.userType !== 'child') {
      return res.status(403).json({ message: 'Only children can use AI chat' });
    }

    const { message } = req.body;
    const child = await Child.findById(req.user._id);
    
    // Get OpenAI API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ message: 'OpenAI API not configured' });
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a friendly, helpful AI assistant for children aged ${child.age}. 
            Keep responses simple, educational, and age-appropriate. 
            Use emojis to make it fun. 
            Never discuss inappropriate topics. 
            Focus on learning, games, math, science, and positive topics.
            Keep responses under 100 words.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ message: 'AI service error' });
    }

    const aiResponse = data.choices[0].message.content;
    res.json({ response: aiResponse });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;