import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ColorMatchGameProps {
  onBack: () => void;
}

const ColorMatchGame: React.FC<ColorMatchGameProps> = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [savedLevel, setSavedLevel] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [colorSequence, setColorSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [showSequence, setShowSequence] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [message, setMessage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isReading, setIsReading] = useState(true);

  const colors = [
    { name: 'Red', emoji: '🔴', bg: '#FF6B6B' },
    { name: 'Blue', emoji: '🔵', bg: '#4ECDC4' },
    { name: 'Yellow', emoji: '🟡', bg: '#FFE66D' },
    { name: 'Green', emoji: '🟢', bg: '#95E1D3' },
    { name: 'Purple', emoji: '🟣', bg: '#C77DFF' },
    { name: 'Orange', emoji: '🟠', bg: '#FF9F1C' }
  ];

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
      const res = await axios.get('http://localhost:5000/api/games/progress', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const progress = res.data.gameProgress.find((p: any) => p.gameId === 'rainbow-memory');
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
      await axios.post('http://localhost:5000/api/games/progress', 
        { gameId: 'rainbow-memory', level: currentLevel, score: currentLevel * 10 },
        { headers: { Authorization: `Bearer ${token}` }}
      );
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  useEffect(() => {
    if (timeLeft > 0 && (isReading || showSequence)) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && showSequence) {
      setShowSequence(false);
      setCanPlay(true);
      setCurrentIndex(-1);
      setMessage('Now repeat the color sequence!');
    }
  }, [timeLeft, isReading, showSequence]);

  const startLevel = () => {
    const sequenceLength = Math.min(2 + level, 8);
    const newSequence = Array.from({ length: sequenceLength }, () => 
      colors[Math.floor(Math.random() * colors.length)].emoji
    );
    setColorSequence(newSequence);
    setUserSequence([]);
    setMessage('');
    setCanPlay(false);
    setCurrentIndex(-1);
    setTimeLeft(15);
    setIsReading(true);
    
    setTimeout(() => {
      setIsReading(false);
      playSequence(newSequence);
    }, 6000);
  };

  const playSequence = (sequence: string[]) => {
    setShowSequence(true);
    setCurrentIndex(0);
    
    for (let i = 0; i < sequence.length; i++) {
      setTimeout(() => {
        setCurrentIndex(i);
      }, i * 3000);
    }
  };

  const handleColorClick = (colorEmoji: string) => {
    if (!canPlay) return;

    const newUserSequence = [...userSequence, colorEmoji];
    setUserSequence(newUserSequence);

    if (newUserSequence.length === colorSequence.length) {
      checkAnswer(newUserSequence);
    }
  };

  const checkAnswer = (userSeq: string[]) => {
    const isCorrect = userSeq.every((color, index) => color === colorSequence[index]);
    
    if (isCorrect) {
      setMessage('🎉 Perfect! Colors matched!');
      setCanPlay(false);
      const nextLevel = level + 1;
      saveProgress(nextLevel);
      if (level < 10) {
        setTimeout(() => setLevel(nextLevel), 2000);
      } else {
        setMessage('🏆 Amazing! You completed all levels!');
      }
    } else {
      setMessage('❌ Oops! Try again!');
      setCanPlay(false);
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
          <h2>🌈 Welcome Back!</h2>
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
      
      <div className="color-match-game">
        <h2>🌈 Rainbow Memory Game</h2>
        <p className="game-description">Watch the colors light up in order, then click them in the same sequence!</p>
        <p className="level-text">Level {level} of 10</p>
        
        {(isReading || showSequence) && (
          <div className="timer-display">⏱️ {timeLeft}s</div>
        )}

        {isReading && (
          <div className="sequence-display">
            <h3>📖 Get Ready! Read the instructions...</h3>
            <p style={{ fontSize: '18px', marginTop: '20px' }}>The colors will light up one by one. Remember the order!</p>
          </div>
        )}

        {!isReading && showSequence && (
          <div className="sequence-display">
            <h3>👀 Watch the Colors!</h3>
            <div className="color-sequence-display">
              {currentIndex >= 0 && currentIndex < colorSequence.length && (
                <div className="color-display-item active-color">
                  <span style={{ fontSize: '80px' }}>{colorSequence[currentIndex]}</span>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '15px' }}>
                    {colors.find(c => c.emoji === colorSequence[currentIndex])?.name}
                  </p>
                </div>
              )}
            </div>
            <p style={{ marginTop: '20px', fontSize: '18px' }}>Color {currentIndex + 1} of {colorSequence.length}</p>
          </div>
        )}

        {!showSequence && !isReading && (
          <div className="game-play-area">
            <h3>{message || 'Click the colors in order!'}</h3>
            
            <div className="user-color-sequence">
              {userSequence.map((color, index) => (
                <span key={index} className="selected-color">{color}</span>
              ))}
            </div>

            <div className="color-grid">
              {colors.map((color, index) => (
                <button
                  key={index}
                  className="color-game-btn"
                  style={{ background: color.bg }}
                  onClick={() => handleColorClick(color.emoji)}
                  disabled={!canPlay}
                >
                  <span style={{ fontSize: '40px' }}>{color.emoji}</span>
                  <p>{color.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="game-info">
          <p>🎯 Sequence Length: {colorSequence.length}</p>
          <p>✨ Your Progress: {userSequence.length}/{colorSequence.length}</p>
        </div>
      </div>
    </div>
  );
};

export default ColorMatchGame;