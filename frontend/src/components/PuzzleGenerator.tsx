import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Puzzle {
  question: string;
  answer: string;
}

const PuzzleGenerator: React.FC = () => {
  const [difficulty, setDifficulty] = useState('easy');
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);

  const generatePuzzle = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Generating puzzle with difficulty:', difficulty);
      
      const response = await axios.post('https://brainboost-16cb.onrender.com/api/games/puzzle',
        { difficulty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Puzzle response:', response.data);
      setPuzzle(response.data);
      setUserAnswer('');
      setShowAnswer(false);
    } catch (error: any) {
      console.error('Failed to generate puzzle:', error);
      alert('Failed to generate puzzle. Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    setShowAnswer(true);
  };

  const isCorrect = puzzle && userAnswer.toLowerCase().trim() === puzzle.answer.toLowerCase().trim();

  return (
    <div className="puzzle-page">
      <header className="puzzle-header">
        <Link to="/games" className="back-btn">← Back to Games</Link>
        <h1>🧩 AI Puzzle Generator</h1>
      </header>

      <div className="puzzle-container">
        <div className="puzzle-controls">
          <h2>Generate a New Puzzle</h2>
          
          <div className="difficulty-selector">
            <label>Choose Difficulty:</label>
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">🟢 Easy</option>
              <option value="medium">🟡 Medium</option>
              <option value="hard">🔴 Hard</option>
            </select>
          </div>

          <button 
            onClick={generatePuzzle} 
            className="generate-btn"
            disabled={loading}
          >
            {loading ? '🔄 Generating...' : '✨ Generate Puzzle'}
          </button>
        </div>

        {puzzle && (
          <div className="puzzle-content">
            <div className="puzzle-question">
              <h3>🤔 Puzzle:</h3>
              <p>{puzzle.question}</p>
            </div>

            <div className="puzzle-answer-section">
              <input
                type="text"
                placeholder="Enter your answer..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="answer-input"
              />
              
              <button 
                onClick={checkAnswer}
                className="check-btn"
                disabled={!userAnswer.trim()}
              >
                🎯 Check Answer
              </button>
            </div>

            {showAnswer && (
              <div className={`answer-result ${isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="result-icon">
                  {isCorrect ? '🎉' : '💭'}
                </div>
                <div className="result-text">
                  {isCorrect ? (
                    <div>
                      <h4>Correct! 🎉</h4>
                      <p>Great job! You solved the puzzle.</p>
                    </div>
                  ) : (
                    <div>
                      <h4>Not quite right 💭</h4>
                      <p>The correct answer is: <strong>{puzzle.answer}</strong></p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="puzzle-tips">
          <h3>💡 Puzzle Tips:</h3>
          <ul>
            <li>🧠 Take your time to think through the problem</li>
            <li>🔍 Look for patterns and relationships</li>
            <li>📝 Break complex problems into smaller parts</li>
            <li>🎯 Don't be afraid to guess and learn</li>
          </ul>
        </div>

        <div className="puzzle-categories">
          <h3>🎲 Puzzle Types:</h3>
          <div className="categories-grid">
            <div className="category-card">
              <h4>🔢 Math Puzzles</h4>
              <p>Number sequences and calculations</p>
            </div>
            <div className="category-card">
              <h4>🧩 Logic Puzzles</h4>
              <p>Reasoning and deduction challenges</p>
            </div>
            <div className="category-card">
              <h4>📝 Word Puzzles</h4>
              <p>Language and vocabulary games</p>
            </div>
            <div className="category-card">
              <h4>🎨 Visual Puzzles</h4>
              <p>Pattern recognition challenges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PuzzleGenerator;