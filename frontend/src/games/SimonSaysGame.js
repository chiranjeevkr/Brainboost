import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SimonSaysGame = () => {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [level, setLevel] = useState(0);
  const [gameStatus, setGameStatus] = useState('start');
  const [showPreview, setShowPreview] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const buttons = [
    { id: 0, color: '#FF6B6B', sound: 'Do' },
    { id: 1, color: '#4ECDC4', sound: 'Re' },
    { id: 2, color: '#45B7D1', sound: 'Mi' },
    { id: 3, color: '#FFA07A', sound: 'Fa' }
  ];

  useEffect(() => {
    if (showPreview && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showPreview && countdown === 0) {
      setShowPreview(false);
      playSequence();
    }
  }, [showPreview, countdown]);

  const startGame = () => {
    const newSeq = [Math.floor(Math.random() * 4)];
    setSequence(newSeq);
    setUserSequence([]);
    setLevel(1);
    setShowPreview(true);
    setCountdown(10);
    setGameStatus('playing');
  };

  const playSequence = async () => {
    setIsPlaying(true);
    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveButton(sequence[i]);
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveButton(null);
    }
    setIsPlaying(false);
  };

  const handleButtonClick = (id) => {
    if (isPlaying || showPreview) return;

    setActiveButton(id);
    setTimeout(() => setActiveButton(null), 300);

    const newUserSeq = [...userSequence, id];
    setUserSequence(newUserSeq);

    if (newUserSeq[newUserSeq.length - 1] !== sequence[newUserSeq.length - 1]) {
      setGameStatus('lose');
      saveScore(level);
      return;
    }

    if (newUserSeq.length === sequence.length) {
      setTimeout(() => nextLevel(), 1000);
    }
  };

  const nextLevel = () => {
    const newSeq = [...sequence, Math.floor(Math.random() * 4)];
    setSequence(newSeq);
    setUserSequence([]);
    setLevel(level + 1);
    playSequence();
  };

  const saveScore = async (finalLevel) => {
    try {
      await axios.post('/api/game-scores/save', {
        gameName: 'Simon Says',
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
        <p style={{ color: '#555', margin: 0 }}>Watch the pattern for 10 seconds, then repeat it by clicking the buttons in the same order!</p>
      </div>

      <h3>🎵 Simon Says</h3>
      <p>Level: {level}</p>

      {gameStatus === 'start' && (
        <button onClick={startGame} className="btn-primary">Start Game</button>
      )}

      {showPreview && (
        <h2 style={{ color: '#f5576c', marginBottom: '20px' }}>Get Ready! {countdown}s</h2>
      )}

      {gameStatus === 'playing' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', maxWidth: '400px', margin: '30px auto' }}>
          {buttons.map(btn => (
            <button
              key={btn.id}
              onClick={() => handleButtonClick(btn.id)}
              disabled={isPlaying || showPreview}
              style={{
                width: '150px',
                height: '150px',
                background: activeButton === btn.id ? btn.color : `${btn.color}99`,
                border: 'none',
                borderRadius: '20px',
                fontSize: '2rem',
                color: 'white',
                cursor: isPlaying || showPreview ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                transform: activeButton === btn.id ? 'scale(0.95)' : 'scale(1)'
              }}
            >
              {btn.sound}
            </button>
          ))}
        </div>
      )}

      {gameStatus === 'lose' && (
        <div>
          <h2>❌ Game Over! Level Reached: {level}</h2>
          <button onClick={() => setGameStatus('start')} className="btn-danger">Try Again</button>
        </div>
      )}
    </div>
  );
};

export default SimonSaysGame;