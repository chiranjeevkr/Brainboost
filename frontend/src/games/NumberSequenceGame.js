import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NumberSequenceGame = () => {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [level, setLevel] = useState(1);
  const [showSequence, setShowSequence] = useState(false);
  const [gameStatus, setGameStatus] = useState('start');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (showSequence && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showSequence && countdown === 0) {
      setShowSequence(false);
    }
  }, [showSequence, countdown]);

  const startGame = () => {
    const newSeq = Array.from({ length: level + 2 }, () => Math.floor(Math.random() * 9) + 1);
    setSequence(newSeq);
    setUserSequence([]);
    setShowSequence(true);
    setCountdown(10);
    setGameStatus('playing');
  };

  const handleNumberClick = (num) => {
    if (showSequence) return;
    
    const newUserSeq = [...userSequence, num];
    setUserSequence(newUserSeq);

    if (newUserSeq.length === sequence.length) {
      if (JSON.stringify(newUserSeq) === JSON.stringify(sequence)) {
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
        gameName: 'Number Sequence',
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
        <p style={{ color: '#555', margin: 0 }}>Memorize the number sequence shown for 10 seconds, then enter the numbers in correct order!</p>
      </div>

      <h3>🔢 Number Sequence Memory</h3>
      <p>Level: {level}</p>
      
      {gameStatus === 'start' && (
        <button onClick={startGame} className="btn-primary">Start Game</button>
      )}

      {showSequence && (
        <div>
          <h2 style={{ color: '#f5576c', marginBottom: '20px' }}>Memorize! {countdown}s</h2>
          <div style={{ fontSize: '3rem', margin: '30px 0' }}>
            {sequence.join(' - ')}
          </div>
        </div>
      )}

      {gameStatus === 'playing' && !showSequence && (
        <div>
          <p>Enter the sequence:</p>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>
            {userSequence.join(' - ') || '...'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                style={{
                  padding: '20px',
                  fontSize: '1.5rem',
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameStatus === 'win' && (
        <div>
          <h2>🎉 Correct! Level {level - 1} Complete!</h2>
          <button onClick={startGame} className="btn-success">Next Level</button>
        </div>
      )}

      {gameStatus === 'lose' && (
        <div>
          <h2>❌ Wrong! Try Again</h2>
          <button onClick={() => { setLevel(1); setGameStatus('start'); }} className="btn-danger">Restart</button>
        </div>
      )}
    </div>
  );
};

export default NumberSequenceGame;