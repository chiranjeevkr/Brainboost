import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CountingStarsGameProps {
  onBack: () => void;
}

const CountingStarsGame: React.FC<CountingStarsGameProps> = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [savedLevel, setSavedLevel] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [stars, setStars] = useState<number[]>([]);
  const [showStars, setShowStars] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [canAnswer, setCanAnswer] = useState(false);
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    if (!showDialog && level > 0) {
      startLevel();
    }
  }, [level, showDialog]);

  const loadProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://brainboost-16cb.onrender.com/api/games/progress', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const progress = res.data.gameProgress.find((p: any) => p.gameId === 'counting-stars');
      if (progress && progress.level > 1) {
        setSavedLevel(progress.level);
        setShowDialog(true);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async (currentLevel: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://brainboost-16cb.onrender.com/api/games/progress', 
        { gameId: 'counting-stars', level: currentLevel, score: currentLevel * 10 },
        { headers: { Authorization: `Bearer ${token}` }}
      );
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  useEffect(() => {
    if (timeLeft > 0 && showStars) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && showStars) {
      setShowStars(false);
      setCanAnswer(true);
      setMessage('How many stars did you see?');
    }
  }, [timeLeft, showStars]);

  const startLevel = () => {
    const starCount = Math.min(3 + level, 15);
    const starPositions = Array.from({ length: starCount }, (_, i) => i);
    setStars(starPositions);
    setUserAnswer('');
    setMessage('Get ready! Count the stars!');
    setCanAnswer(false);
    setTimeLeft(5);
    
    setTimeout(() => {
      setShowStars(true);
    }, 1000);
  };

  const checkAnswer = () => {
    const correctAnswer = stars.length;
    const userNum = parseInt(userAnswer);
    
    if (userNum === correctAnswer) {
      setMessage('⭐ Amazing! You counted correctly!');
      setCanAnswer(false);
      const nextLevel = level + 1;
      saveProgress(nextLevel);
      if (level < 10) {
        setTimeout(() => setLevel(nextLevel), 2000);
      } else {
        setMessage('🏆 Fantastic! You completed all levels!');
      }
    } else {
      setMessage(`❌ Not quite! There were ${correctAnswer} stars. Try again!`);
      setCanAnswer(false);
      setTimeout(() => startLevel(), 2000);
    }
  };

  if (showDialog) {
    return (
      <div className="game-container">
        <button onClick={onBack} className="back-btn">← Back to Games</button>
        <div className="continue-dialog" style={{
          textAlign: 'center',
          maxWidth: '500px',
          margin: '100px auto',
          padding: '40px',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '20px'
        }}>
          <h2>⭐ Welcome Back!</h2>
          <p style={{ fontSize: '18px', margin: '20px 0' }}>You reached Level {savedLevel} last time.</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
            <button onClick={() => { setLevel(savedLevel); setShowDialog(false); }} style={{
              padding: '15px 30px',
              fontSize: '18px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              cursor: 'pointer'
            }}>Continue</button>
            <button onClick={() => { setLevel(1); setShowDialog(false); }} style={{
              padding: '15px 30px',
              fontSize: '18px',
              borderRadius: '10px',
              border: '2px solid white',
              background: 'transparent',
              color: 'white',
              cursor: 'pointer'
            }}>Start Over</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <button onClick={onBack} className="back-btn">← Back to Games</button>
      
      <div className="number-game">
        <h2>⭐ Counting Stars</h2>
        <p className="game-description">Watch the stars appear and count them quickly!</p>
        <p className="level-text">Level {level} of 10</p>
        
        {showStars && (
          <div className="timer-display">⏱️ {timeLeft}s</div>
        )}

        {showStars && (
          <div className="stars-display">
            {stars.map((_, index) => (
              <span 
                key={index} 
                className="star-item"
                style={{
                  fontSize: '40px',
                  animation: `starAppear 0.5s ease ${index * 0.1}s`,
                  display: 'inline-block',
                  margin: '10px'
                }}
              >
                ⭐
              </span>
            ))}
          </div>
        )}

        {!showStars && canAnswer && (
          <div className="answer-section">
            <h3>{message}</h3>
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter number"
              className="number-input"
              style={{
                padding: '15px',
                fontSize: '24px',
                borderRadius: '10px',
                border: '2px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                textAlign: 'center',
                width: '150px',
                margin: '20px auto',
                display: 'block'
              }}
            />
            <button 
              onClick={checkAnswer}
              disabled={!userAnswer}
              style={{
                padding: '15px 30px',
                fontSize: '18px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Check Answer
            </button>
          </div>
        )}

        {!showStars && !canAnswer && (
          <div className="waiting-message">
            <h3>{message}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountingStarsGame;
