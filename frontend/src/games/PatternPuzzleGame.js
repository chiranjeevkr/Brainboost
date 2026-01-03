import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatternPuzzleGame = () => {
  const [pattern, setPattern] = useState([]);
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameStatus, setGameStatus] = useState('start');
  const [showPreview, setShowPreview] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const shapes = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '⭐', '💎', '🔷', '🔶'];
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  useEffect(() => {
    if (showPreview && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showPreview && countdown === 0) {
      setShowPreview(false);
    }
  }, [showPreview, countdown]);

  const generatePattern = () => {
    const patternType = Math.floor(Math.random() * 4);
    let newPattern = [];
    let answer = '';

    if (patternType === 0) {
      // Repeating shape pattern
      const shape1 = shapes[Math.floor(Math.random() * shapes.length)];
      const shape2 = shapes[Math.floor(Math.random() * shapes.length)];
      const repeatCount = level + 1;
      for (let i = 0; i < repeatCount; i++) {
        newPattern.push(shape1, shape2);
      }
      answer = shape1;
    } else if (patternType === 1) {
      // Increasing number pattern
      const start = Math.floor(Math.random() * 5) + 1;
      const step = level;
      for (let i = 0; i < 4; i++) {
        newPattern.push((start + i * step).toString());
      }
      answer = (start + 4 * step).toString();
    } else if (patternType === 2) {
      // Alternating shapes with increasing count
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      for (let i = 1; i <= 3; i++) {
        for (let j = 0; j < i; j++) {
          newPattern.push(shape);
        }
        newPattern.push('|');
      }
      newPattern.pop();
      answer = shape;
    } else {
      // Complex mixed pattern
      const shape1 = shapes[Math.floor(Math.random() * shapes.length)];
      const shape2 = shapes[Math.floor(Math.random() * shapes.length)];
      const shape3 = shapes[Math.floor(Math.random() * shapes.length)];
      newPattern = [shape1, shape2, shape3, shape1, shape2, shape3, shape1, shape2];
      answer = shape3;
    }

    // Generate wrong options
    const wrongOptions = [];
    while (wrongOptions.length < 3) {
      const randomOption = Math.random() > 0.5 
        ? shapes[Math.floor(Math.random() * shapes.length)]
        : numbers[Math.floor(Math.random() * numbers.length)];
      if (randomOption !== answer && !wrongOptions.includes(randomOption)) {
        wrongOptions.push(randomOption);
      }
    }

    const allOptions = [answer, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setPattern(newPattern);
    setCorrectAnswer(answer);
    setOptions(allOptions);
  };

  const startGame = () => {
    setScore(0);
    setTotalQuestions(0);
    setShowPreview(true);
    setCountdown(10);
    setGameStatus('playing');
    generatePattern();
  };

  const handleAnswer = (selected) => {
    const newTotal = totalQuestions + 1;
    setTotalQuestions(newTotal);

    if (selected === correctAnswer) {
      const newScore = score + 1;
      setScore(newScore);
      
      if (newTotal >= 5) {
        setLevel(level + 1);
        setGameStatus('win');
        saveScore(level);
      } else {
        setTimeout(() => {
          generatePattern();
          setShowPreview(true);
          setCountdown(10);
        }, 500);
      }
    } else {
      setGameStatus('lose');
      saveScore(level);
    }
  };

  const saveScore = async (finalLevel) => {
    try {
      await axios.post('/api/game-scores/save', {
        gameName: 'Pattern Puzzle',
        score: finalLevel * 10 + score * 5,
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
        <p style={{ color: '#555', margin: 0 }}>Study the pattern for 10 seconds, then choose what comes next! Complete 5 patterns to advance!</p>
      </div>

      <h3>🧩 Pattern Puzzle Challenge</h3>
      <p>Level: {level} | Score: {score}/5</p>

      {gameStatus === 'start' && (
        <button onClick={startGame} className="btn-primary">Start Game</button>
      )}

      {showPreview && (
        <h2 style={{ color: '#f5576c', marginBottom: '20px' }}>Study the pattern! {countdown}s</h2>
      )}

      {gameStatus === 'playing' && (
        <div>
          {showPreview && (
            <div style={{ 
              fontSize: '2.5rem', 
              margin: '30px 0', 
              padding: '20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '15px',
              color: 'white',
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {pattern.map((item, idx) => (
                <span key={idx}>{item}</span>
              ))}
              <span style={{ fontSize: '3rem' }}>?</span>
            </div>
          )}

          {!showPreview && (
            <div>
              <div style={{ 
                fontSize: '2.5rem', 
                margin: '30px 0', 
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '15px',
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                {pattern.map((item, idx) => (
                  <span key={idx}>{item}</span>
                ))}
                <span style={{ fontSize: '3rem', color: '#667eea' }}>?</span>
              </div>

              <p style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#555' }}>What comes next?</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', maxWidth: '400px', margin: '0 auto' }}>
                {options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    style={{
                      padding: '30px',
                      fontSize: '3rem',
                      background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {gameStatus === 'win' && (
        <div>
          <h2>🎉 Excellent! Level {level} Complete!</h2>
          <p>You got {score}/5 patterns correct!</p>
          <button onClick={startGame} className="btn-success">Next Level</button>
        </div>
      )}

      {gameStatus === 'lose' && (
        <div>
          <h2>❌ Wrong Answer! Final Score: {score}/5</h2>
          <button onClick={() => { setLevel(1); setGameStatus('start'); }} className="btn-danger">Try Again</button>
        </div>
      )}
    </div>
  );
};

export default PatternPuzzleGame;