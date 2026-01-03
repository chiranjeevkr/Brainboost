import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import MathQuizGame from '../games/MathQuizGame';
import NumberSequenceGame from '../games/NumberSequenceGame';
import ColorPatternGame from '../games/ColorPatternGame';
import WordMemoryGame from '../games/WordMemoryGame';
import SudokuGame from '../games/SudokuGame';

const GamesPage = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    { id: 1, name: 'Math Quiz', icon: '🧮', component: <MathQuizGame />, color: '#667eea' },
    { id: 2, name: 'Number Sequence', icon: '🔢', component: <NumberSequenceGame />, color: '#11998e' },
    { id: 3, name: 'Color Pattern', icon: '🎨', component: <ColorPatternGame />, color: '#f093fb' },
    { id: 4, name: 'Word Memory', icon: '📝', component: <WordMemoryGame />, color: '#FF6B6B' },
    { id: 5, name: 'Sudoku', icon: '🔢', component: <SudokuGame />, color: '#3498db' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Navbar />
      <div style={{ padding: '40px 20px' }}>
        {!selectedGame ? (
          <div>
            <h1 style={{ textAlign: 'center', color: 'white', marginBottom: '40px', fontSize: '2.5rem' }}>
              🎮 Brain Boost Games 🧠
            </h1>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '30px', 
              maxWidth: '1200px', 
              margin: '0 auto' 
            }}>
              {games.map(game => (
                <div
                  key={game.id}
                  onClick={() => setSelectedGame(game)}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ fontSize: '4rem', marginBottom: '15px' }}>{game.icon}</div>
                  <h3 style={{ color: game.color, marginBottom: '10px' }}>{game.name}</h3>
                  <p style={{ color: '#666' }}>Click to play!</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <button 
              onClick={() => setSelectedGame(null)} 
              className="btn-primary"
              style={{ marginBottom: '20px' }}
            >
              ← Back to Games
            </button>
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
              {selectedGame.component}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamesPage;