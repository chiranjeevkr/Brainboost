import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const AIChatPage = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your BrainBoost AI friend! 🤖 Ask me anything - math questions, fun facts, or help with homework!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    // Simple AI responses (you can integrate with OpenAI API later)
    const response = generateResponse(input);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
    }, 1000);
  };

  const generateResponse = (question) => {
    const q = question.toLowerCase();
    
    if (q.includes('hello') || q.includes('hi')) {
      return 'Hello! 👋 How can I help you today?';
    } else if (q.includes('math') || q.includes('calculate') || q.includes('+') || q.includes('-') || q.includes('*') || q.includes('/')) {
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
          else if (op === '/') result = num1 / num2;
          return `The answer is ${result}! 🧮`;
        }
      } catch (e) {}
      return 'I can help with math! Try asking like "What is 5 + 3?" 🧮';
    } else if (q.includes('game') || q.includes('play')) {
      return 'You can play amazing brain games! Click on "Play Memory Games" from your dashboard! 🎮';
    } else if (q.includes('score') || q.includes('performance')) {
      return 'Check your leaderboard to see your scores and progress! 🏆';
    } else if (q.includes('help')) {
      return 'I can help you with:\n• Math problems 🧮\n• Fun facts 🌟\n• Game tips 🎮\n• General questions 💡\nJust ask me anything!';
    } else if (q.includes('fact')) {
      const facts = [
        'Did you know? Your brain has about 86 billion neurons! 🧠',
        'Fun fact: Playing memory games can improve your brain power! 💪',
        'Amazing! Your brain uses 20% of your body\'s energy! ⚡',
        'Cool fact: You can\'t tickle yourself because your brain predicts it! 😄'
      ];
      return facts[Math.floor(Math.random() * facts.length)];
    } else {
      return 'That\'s an interesting question! I\'m still learning. Try asking me about math, games, or say "help" to see what I can do! 🤖';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <div className="card" style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ color: '#667eea', marginBottom: '20px', textAlign: 'center' }}>
            🤖 AI Chat Assistant
          </h2>

          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '20px', 
            background: '#f8f9fa', 
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                marginBottom: '15px',
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 18px',
                  borderRadius: '18px',
                  background: msg.role === 'user' 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'white',
                  color: msg.role === 'user' ? 'white' : '#333',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ textAlign: 'center', color: '#667eea' }}>
                <span>AI is thinking...</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              style={{ 
                flex: 1, 
                padding: '12px', 
                borderRadius: '25px',
                border: '2px solid #667eea'
              }}
            />
            <button 
              onClick={handleSend}
              className="btn-primary"
              disabled={loading}
            >
              Send 📤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;