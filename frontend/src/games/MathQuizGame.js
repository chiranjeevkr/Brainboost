import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MathQuizGame = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameStatus, setGameStatus] = useState('start');
  const [showPreview, setShowPreview] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (showPreview && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showPreview && countdown === 0) {
      setShowPreview(false);
    }
  }, [showPreview, countdown]);

  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * (10 * level)) + 1;
    const num2 = Math.floor(Math.random() * (10 * level)) + 1;
    const operations = ['+', '-', '*'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    
    let ans;
    if (op === '+') ans = num1 + num2;
    else if (op === '-') ans = num1 - num2;
    else ans = num1 * num2;
    
    return { question: `${num1} ${op} ${num2}`, answer: ans };
  };

  const startGame = () => {
    const newQuestions = Array.from({ length: 5 }, () => generateQuestion());
    setQuestions(newQuestions);
    setScore(0);
    setShowPreview(true);
    setCountdown(10);
    setGameStatus('playing');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(userAnswer) === questions[score].answer) {
      const newScore = score + 1;
      setScore(newScore);
      setUserAnswer('');
      
      if (newScore === 5) {
        setLevel(level + 1);
        setGameStatus('win');
        saveScore(level);
      }
    } else {
      setGameStatus('lose');
      saveScore(level);
    }
  };

  const saveScore = async (finalLevel) => {
    try {
      await axios.post('/api/game-scores/save', {
        gameName: 'Math Quiz',
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
        <p style={{ color: '#555', margin: 0 }}>Solve 5 math problems correctly to advance to the next level!</p>
      </div>

      <h3>🧮 Math Quiz</h3>
      <p>Level: {level} | Score: {score}/5</p>

      {gameStatus === 'start' && (
        <button onClick={startGame} className="btn-primary">Start Game</button>
      )}

      {showPreview && (
        <h2 style={{ color: '#f5576c', marginBottom: '20px' }}>Get Ready! {countdown}s</h2>
      )}

      {gameStatus === 'playing' && !showPreview && questions[score] && (
        <div>
          <div style={{ fontSize: '3rem', margin: '30px 0', color: '#667eea' }}>
            {questions[score].question} = ?
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Your answer"
              style={{ padding: '15px', fontSize: '1.5rem', width: '200px', textAlign: 'center' }}
              autoFocus
            />
            <br />
            <button type="submit" className="btn-success" style={{ marginTop: '20px' }}>Submit</button>
          </form>
        </div>
      )}

      {gameStatus === 'win' && (
        <div>
          <h2>🎉 Perfect! Level {level} Complete!</h2>
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

export default MathQuizGame;