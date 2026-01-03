import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WordMemoryGame = () => {
  const wordLists = [
    ['CAT', 'DOG', 'BIRD', 'FISH'],
    ['APPLE', 'BANANA', 'ORANGE', 'GRAPE', 'MANGO'],
    ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'PINK'],
    ['SUN', 'MOON', 'STAR', 'CLOUD', 'RAIN', 'SNOW', 'WIND']
  ];
  
  const [words, setWords] = useState([]);
  const [showWords, setShowWords] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [guessedWords, setGuessedWords] = useState([]);
  const [level, setLevel] = useState(0);
  const [gameStatus, setGameStatus] = useState('start');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (showWords && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showWords && countdown === 0) {
      setShowWords(false);
    }
  }, [showWords, countdown]);

  const startGame = () => {
    setWords(wordLists[level]);
    setGuessedWords([]);
    setUserInput('');
    setShowWords(true);
    setCountdown(10);
    setGameStatus('playing');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const word = userInput.toUpperCase().trim();
    
    if (words.includes(word) && !guessedWords.includes(word)) {
      const newGuessed = [...guessedWords, word];
      setGuessedWords(newGuessed);
      setUserInput('');
      
      if (newGuessed.length === words.length) {
        setGameStatus('win');
        saveScore(level + 1);
      }
    } else {
      setUserInput('');
    }
  };

  const saveScore = async (finalLevel) => {
    try {
      await axios.post('/api/game-scores/save', {
        gameName: 'Word Memory',
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
        <p style={{ color: '#555', margin: 0 }}>Memorize all the words shown for 10 seconds, then type them back one by one!</p>
      </div>

      <h3>📝 Word Memory Challenge</h3>
      <p>Level: {level + 1}</p>
      
      {gameStatus === 'start' && (
        <div>
          <p>Memorize the words that appear!</p>
          <button onClick={startGame} className="btn-primary">Start Game</button>
        </div>
      )}

      {showWords && (
        <div>
          <h2 style={{ color: '#f5576c', marginBottom: '20px' }}>Memorize! {countdown}s</h2>
          <div style={{ fontSize: '2rem', margin: '30px 0', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {words.map((word, idx) => (
              <div key={idx} style={{ 
                padding: '15px 25px', 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                borderRadius: '10px',
                fontWeight: 'bold'
              }}>
                {word}
              </div>
            ))}
          </div>
        </div>
      )}

      {gameStatus === 'playing' && !showWords && (
        <div>
          <p>Type the words you remember:</p>
          <div style={{ marginBottom: '20px' }}>
            <strong>Guessed: {guessedWords.length} / {words.length}</strong>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
              {guessedWords.map((word, idx) => (
                <span key={idx} style={{ padding: '5px 15px', background: '#4ECDC4', color: 'white', borderRadius: '5px' }}>
                  {word}
                </span>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter word"
              style={{ padding: '10px', fontSize: '1rem', width: '200px' }}
            />
            <button type="submit" className="btn-success">Submit</button>
          </form>
        </div>
      )}

      {gameStatus === 'win' && (
        <div>
          <h2>🎉 Amazing Memory! Level {level + 1} Complete!</h2>
          {level < wordLists.length - 1 ? (
            <button onClick={() => { setLevel(level + 1); setGameStatus('start'); }} className="btn-success">Next Level</button>
          ) : (
            <div>
              <h3>🏆 You completed all levels!</h3>
              <button onClick={() => { setLevel(0); setGameStatus('start'); }} className="btn-primary">Play Again</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WordMemoryGame;