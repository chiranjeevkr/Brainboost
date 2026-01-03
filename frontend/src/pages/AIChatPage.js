import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

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

    try {
      const response = await axios.post('/api/ai/chat', { message: input });
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I\'m having trouble right now. Please try again! 😊' 
      }]);
    }
    
    setLoading(false);
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