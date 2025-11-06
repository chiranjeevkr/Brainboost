import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface KidMemoryGameProps {
  onBack: () => void;
}

const KidMemoryGame: React.FC<KidMemoryGameProps> = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [savedLevel, setSavedLevel] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [showSequence, setShowSequence] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);

  const animals = ['🐶', '🐱', '🐰', '🐸', '🦋', '🐝', '🐼', '🦁'];

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
      const progress = res.data.gameProgress.find((p: any) => p.gameId === 'animal-memory');
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
        { gameId: 'animal-memory', level: currentLevel, score: currentLevel * 10 },
        { headers: { Authorization: `Bearer ${token}` }}
      );
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  useEffect(() => {
    if (showSequence && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, showSequence]);

  const startLevel = () => {
    const sequenceLength = Math.min(2 + level, 8);
    const newSequence = Array.from({ length: sequenceLength }, () => 
      animals[Math.floor(Math.random() * animals.length)]
    );
    setSequence(newSequence);
    setUserSequence([]);
    setMessage('');
    setShowSequence(true);
    setCanPlay(false);
    setTimeLeft(10);

    setTimeout(() => {
      setShowSequence(false);
      setCanPlay(true);
      setMessage('Now repeat the sequence!');
    }, 10000);
  };

  const handleAnimalClick = (animal: string) => {
    if (!canPlay) return;

    const newUserSequence = [...userSequence, animal];
    setUserSequence(newUserSequence);

    if (newUserSequence.length === sequence.length) {
      checkAnswer(newUserSequence);
    }
  };

  const checkAnswer = (userSeq: string[]) => {
    const isCorrect = userSeq.every((animal, index) => animal === sequence[index]);
    
    if (isCorrect) {
      setMessage('🎉 Perfect! You remembered it!');
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
          <h2>🐾 Welcome Back!</h2>
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
      
      <div className="kid-memory-game">
        <h2>🐾 Animal Memory Game</h2>
        <p className="game-description">Watch the animals, remember the order, then click them in the same sequence!</p>
        <p className="level-text">Level {level} of 10</p>

        {showSequence && (
          <div className="sequence-display">
            <div className="timer-display">⏱️ {timeLeft}s</div>
            <h3>👀 Watch and Remember!</h3>
            <div className="animal-sequence">
              {sequence.map((animal, index) => (
                <div key={index} className="animal-item animate">
                  {animal}
                </div>
              ))}
            </div>
          </div>
        )}

        {!showSequence && (
          <div className="game-play-area">
            <h3>{message || 'Click the animals in order!'}</h3>
            
            <div className="user-sequence">
              {userSequence.map((animal, index) => (
                <span key={index} className="selected-animal">{animal}</span>
              ))}
            </div>

            <div className="animal-grid">
              {animals.map((animal, index) => (
                <button
                  key={index}
                  className="animal-btn"
                  onClick={() => handleAnimalClick(animal)}
                  disabled={!canPlay}
                >
                  {animal}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="game-info">
          <p>🎯 Sequence Length: {sequence.length}</p>
          <p>✨ Your Progress: {userSequence.length}/{sequence.length}</p>
        </div>
      </div>
    </div>
  );
};

export default KidMemoryGame;