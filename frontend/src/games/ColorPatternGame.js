import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ColorPatternGame = () => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
  const [pattern, setPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [showPattern, setShowPattern] = useState(false);
  const [level, setLevel] = useState(1);
  const [gameStatus, setGameStatus] = useState('start');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (showPattern && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showPattern && countdown === 0) {
      setShowPattern(false);
    }
  }, [showPattern, countdown]);

  const startGame = () => {
    const newPattern = Array.from({ length: level + 2 }, () => colors[Math.floor(Math.random() * colors.length)]);
    setPattern(newPattern);
    setUserPattern([]);
    setShowPattern(true);
    setCountdown(10);
    setGameStatus('playing');
  };

  const handleColorClick = (color) => {
    if (showPattern) return;
    
    const newUserPattern = [...userPattern, color];
    setUserPattern(newUserPattern);

    if (newUserPattern.length === pattern.length) {
      if (JSON.stringify(newUserPattern) === JSON.stringify(pattern)) {
        setGameStatus('win');
        setLevel(level + 1);
      } else {
        setGameStatus('lose');
        saveScore(level);
      }
    }
  };

  const saveScore = async (finalLevel) => {
    try {
      await axios.post('/api/game-scores/save', {
        gameName: 'Color Pattern',
        score: finalLevel * 10,
        level: finalLevel
      });
    } catch (error) {
      console.error('Failed to save score');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ marginBottom: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '10px', textAlign: 'left' }}>
        <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>🎯 How to Play:</h4>
        <p style={{ color: '#555', margin: 0 }}>Memorize the color pattern for 10 seconds, then click the colors in the same order!</p>
      </div>

      <h3>🎨 Color Pattern Memory</h3>
      <p>Level: {level}</p>
      
      {gameStatus === 'start' && (
        <button onClick={startGame} className="btn-primary">Start Game</button>
      )}

      {showPattern && (
        <div>
          <h2 style={{ color: '#f5576c', marginBottom: '20px' }}>Memorize! {countdown}s</h2>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '30px 0' }}>
            {pattern.map((color, idx) => (
              <div key={idx} style={{ width: '60px', height: '60px', background: color, borderRadius: '10px' }} />
            ))}
          </div>
        </div>
      )}

      {gameStatus === 'playing' && !showPattern && (
        <div>
          <p>Click the colors in order:</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
            {userPattern.map((color, idx) => (
              <div key={idx} style={{ width: '40px', height: '40px', background: color, borderRadius: '5px' }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', maxWidth: '400px', margin: '0 auto' }}>
            {colors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => handleColorClick(color)}
                style={{
                  width: '100px',
                  height: '100px',
                  background: color,
                  border: 'none',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              />
            ))}
          </div>
        </div>
      )}

      {gameStatus === 'win' && (
        <div>
          <h2>🎉 Perfect! Level {level - 1} Complete!</h2>
          <button onClick={startGame} className="btn-success">Next Level</button>
        </div>
      )}

      {gameStatus === 'lose' && (
        <div>
          <h2>❌ Wrong Pattern! Try Again</h2>
          <button onClick={() => { setLevel(1); setGameStatus('start'); }} className="btn-danger">Restart</button>
        </div>
      )}
    </div>
  );
};

export default ColorPatternGame;