const express = require('express');
const auth = require('../middleware/auth');
const Child = require('../models/Child');
const router = express.Router();

// Simple AI responses (fallback)
const generateResponse = (question, age) => {
  const q = question.toLowerCase();
  
  if (q.includes('hello') || q.includes('hi')) {
    return 'Hello! 👋 How can I help you today?';
  } else if (q.match(/\d+\s*[\+\-\*\/]\s*\d+/)) {
    try {
      const match = q.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
      if (match) {
        const num1 = parseInt(match[1]);
        const op = match[2];
        const num2 = parseInt(match[3]);
        let result;
        if (op === '+') result = num1 + num2;
        else if (op === '-') result = num1 - num2;
        else if (op === '*') result = num1 * num2;
        else if (op === '/') result = Math.round(num1 / num2 * 100) / 100;
        return `The answer is ${result}! 🧮 Great job asking!`;
      }
    } catch (e) {}
  }
  
  if (q.includes('game') || q.includes('play')) {
    return 'You can play amazing brain games! 🎮 Try Math Quiz, Number Sequence, Color Pattern, or Word Memory!';
  } else if (q.includes('score') || q.includes('performance')) {
    return 'Check your leaderboard to see your scores and progress! 🏆 Keep playing to improve!';
  } else if (q.includes('help')) {
    return 'I can help you with:\n• Math problems 🧮\n• Fun facts 🌟\n• Game tips 🎮\n• Science questions 🔬\n• General questions 💡\nJust ask me anything!';
  } else if (q.includes('fact') || q.includes('tell me')) {
    const facts = [
      'Did you know? Your brain has about 86 billion neurons! 🧠',
      'Fun fact: Playing memory games can improve your brain power! 💪',
      'Amazing! Your brain uses 20% of your body\'s energy! ⚡',
      'Cool fact: You can\'t tickle yourself because your brain predicts it! 😄',
      'Wow! Your brain can process information faster than a computer! 🚀',
      'Interesting! Learning new things creates new connections in your brain! 🌟'
    ];
    return facts[Math.floor(Math.random() * facts.length)];
  } else if (q.includes('science') || q.includes('space') || q.includes('planet')) {
    return 'Science is amazing! 🔬 The universe has billions of galaxies, and Earth is the only planet we know with life! Want to learn more?';
  } else if (q.includes('animal')) {
    return 'Animals are fascinating! 🦁 Did you know dolphins sleep with one eye open? What animal do you want to know about?';
  } else {
    return `That's an interesting question! 🤔 I'm here to help with math, science, fun facts, and games. Try asking me something specific!`;
  }
};

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
    
    // Try OpenAI first if key is valid
    if (apiKey && apiKey.startsWith('sk-')) {
      try {
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
        
        if (!data.error && data.choices && data.choices[0]) {
          const aiResponse = data.choices[0].message.content;
          return res.json({ response: aiResponse });
        }
      } catch (error) {
        console.log('OpenAI error, using fallback');
      }
    }
    
    // Fallback to simple responses
    const response = generateResponse(message, child.age);
    res.json({ response });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;