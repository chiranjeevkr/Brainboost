import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CreativityGameProps {
  onBack: () => void;
}

const CreativityGame: React.FC<CreativityGameProps> = ({ onBack }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [grid, setGrid] = useState<boolean[][]>([]);
  const [targetPattern, setTargetPattern] = useState<boolean[][]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPattern, setShowPattern] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  const gridSize = Math.min(3 + Math.floor(currentLevel / 2), 8);

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    if (!showDialog && currentLevel > 0) {
      initializeLevel();
    }
  }, [currentLevel, showDialog]);

  const loadProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://brainboost-16cb.onrender.com/api/games/progress', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const progress = res.data.gameProgress.find((p: any) => p.gameId === 'pattern-creator');
      if (progress && progress.level > 1) {
        setUnlockedLevel(progress.level);
        setShowDialog(true);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async (level: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://brainboost-16cb.onrender.com/api/games/progress', 
        { gameId: 'pattern-creator', level: level, score: level * 10 },
        { headers: { Authorization: `Bearer ${token}` }}
      );
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  useEffect(() => {
    if (showPattern && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && showPattern) {
      setShowPattern(false);
    }
  }, [timeLeft, showPattern]);

  const initializeLevel = () => {
    const size = gridSize;
    const newGrid = Array(size).fill(null).map(() => Array(size).fill(false));
    const newTarget = generateTargetPattern(size, currentLevel);
    setGrid(newGrid);
    setTargetPattern(newTarget);
    setShowSuccess(false);
    const time = Math.max(10 - currentLevel, 3);
    setTimeLeft(time);
    setShowPattern(true);
  };

  const generateTargetPattern = (size: number, level: number): boolean[][] => {
    const pattern = Array(size).fill(null).map(() => Array(size).fill(false));
    const complexity = Math.min(2 + level, size * size / 2);
    
    for (let i = 0; i < complexity; i++) {
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      pattern[row][col] = true;
    }
    
    return pattern;
  };

  const toggleCell = (row: number, col: number) => {
    if (showPattern) return;
    
    const newGrid = grid.map((r, i) => 
      r.map((cell, j) => (i === row && j === col ? !cell : cell))
    );
    setGrid(newGrid);
    checkPattern(newGrid);
  };

  const checkPattern = (currentGrid: boolean[][]) => {
    const matches = currentGrid.every((row, i) =>
      row.every((cell, j) => cell === targetPattern[i][j])
    );
    
    if (matches) {
      setShowSuccess(true);
      if (currentLevel === unlockedLevel && currentLevel < 10) {
        const nextLevel = currentLevel + 1;
        setUnlockedLevel(nextLevel);
        saveProgress(nextLevel);
      }
    }
  };

  const nextLevel = () => {
    if (currentLevel < 10) {
      setCurrentLevel(currentLevel + 1);
    }
  };

  const selectLevel = (level: number) => {
    if (level <= unlockedLevel) {
      setCurrentLevel(level);
    }
  };

  const memoryTime = Math.max(10 - currentLevel, 3);

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
          <h2>💡 Welcome Back!</h2>
          <p style={{ fontSize: '18px', margin: '20px 0' }}>You unlocked Level {unlockedLevel} last time.</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
            <button onClick={() => { setCurrentLevel(unlockedLevel); setShowDialog(false); }} style={{
              padding: '15px 30px',
              fontSize: '18px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              cursor: 'pointer'
            }}>Continue</button>
            <button onClick={() => { setCurrentLevel(1); setUnlockedLevel(1); setShowDialog(false); }} style={{
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
      
      <div className="creativity-game">
        <h2>💡 Pattern Creator</h2>
        <p>Level {currentLevel} of 10</p>
        
        <div className="level-selector">
          {Array.from({ length: 10 }, (_, i) => i + 1).map(level => (
            <button
              key={level}
              className={`level-btn ${level === currentLevel ? 'active' : ''} ${level > unlockedLevel ? 'locked' : ''}`}
              onClick={() => selectLevel(level)}
              disabled={level > unlockedLevel}
            >
              {level > unlockedLevel ? '🔒' : level}
            </button>
          ))}
        </div>

        {showPattern ? (
          <div className="game-instructions">
            <h3>⏱️ Memorize the Pattern: {timeLeft}s</h3>
            <div className="pattern-grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
              {targetPattern.map((row, i) =>
                row.map((cell, j) => (
                  <div key={`target-${i}-${j}`} className={`pattern-cell ${cell ? 'active' : ''}`}>
                    {cell ? '⭐' : ''}
                  </div>
                ))
              )}
            </div>
            <p style={{ marginTop: '20px', fontSize: '18px' }}>
              Study this pattern carefully! It will disappear in {timeLeft} seconds.
            </p>
          </div>
        ) : (
          <div className="game-instructions">
            <h3>Recreate the Pattern from Memory:</h3>
            <div className="pattern-grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
              {grid.map((row, i) =>
                row.map((cell, j) => (
                  <div
                    key={`grid-${i}-${j}`}
                    className={`pattern-cell clickable ${cell ? 'active' : ''}`}
                    onClick={() => toggleCell(i, j)}
                  >
                    {cell ? '⭐' : ''}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="success-message">
            <h3>🎉 Perfect! Pattern Matched!</h3>
            <div className="success-actions">
              <button onClick={initializeLevel} className="retry-btn">🔄 Retry Level</button>
              {currentLevel < 10 && (
                <button onClick={nextLevel} className="next-btn">➡️ Next Level</button>
              )}
              {currentLevel === 10 && (
                <p style={{ color: '#4CAF50', fontWeight: 'bold' }}>🏆 All Levels Completed!</p>
              )}
            </div>
          </div>
        )}

        <div className="game-tips">
          <h4>💡 How to Play:</h4>
          <ul>
            <li>Memorize the pattern shown for {memoryTime} seconds</li>
            <li>Pattern disappears - recreate it from memory</li>
            <li>Click cells to toggle stars on/off</li>
            <li>Memory time decreases as levels increase</li>
            <li>Grid size grows with difficulty</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreativityGame;