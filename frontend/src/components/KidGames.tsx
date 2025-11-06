import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import KidMemoryGame from './KidMemoryGame';
import ColorMatchGame from './ColorMatchGame';
import CountingStarsGame from './CountingStarsGame';

const KidGames: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  const memoryGames = [
    { id: 'animal-memory', name: '🐾 Animal Memory', description: 'Remember the animals!' },
    { id: 'rainbow-memory', name: '🌈 Rainbow Memory', description: 'Match the color sequence!' },
    { id: 'counting-stars', name: '⭐ Counting Stars', description: 'Count the stars quickly!' }
  ];



  const renderMemoryCardGame = () => {
    const cards = ['🐶', '🐱', '🐰', '🐸', '🦋', '🐝'];
    const gameCards = [...cards, ...cards].sort(() => Math.random() - 0.5);
    
    return (
      <div className="memory-game">
        <div className="game-header">
          <h3>Memory Cards - Level {level}</h3>
          <p>Score: {score}</p>
        </div>
        <div className="cards-grid">
          {gameCards.map((card, index) => (
            <div key={index} className="memory-card" onClick={() => setScore(score + 10)}>
              <div className="card-front">?</div>
              <div className="card-back">{card}</div>
            </div>
          ))}
        </div>
        <button onClick={() => setLevel(level + 1)}>Next Level</button>
      </div>
    );
  };

  const renderColorSequenceGame = () => {
    const colors = ['🔴', '🟡', '🟢', '🔵'];
    
    return (
      <div className="color-game">
        <h3>Color Sequence - Level {level}</h3>
        <p>Watch and repeat the sequence!</p>
        <div className="color-buttons">
          {colors.map((color, index) => (
            <button key={index} className="color-btn" onClick={() => setScore(score + 15)}>
              {color}
            </button>
          ))}
        </div>
        <button onClick={() => setLevel(level + 1)}>Next Level</button>
      </div>
    );
  };

  if (selectedGame === 'animal-memory') {
    return <KidMemoryGame onBack={() => setSelectedGame(null)} />;
  }

  if (selectedGame === 'rainbow-memory') {
    return <ColorMatchGame onBack={() => setSelectedGame(null)} />;
  }

  if (selectedGame === 'counting-stars') {
    return <CountingStarsGame onBack={() => setSelectedGame(null)} />;
  }



  return (
    <div className="games-page">
      <header className="games-header">
        <h1>🎮 Kids Games</h1>
        <div className="nav-menu">
          <Link to="/puzzle" className="nav-btn">🧩 Puzzles</Link>
          <Link to="/iq-test" className="nav-btn">🧠 IQ Test</Link>
          <Link to="/progress" className="nav-btn">📊 Progress</Link>
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="nav-btn">Logout</button>
        </div>
      </header>
      
      <div className="games-section">
        <h2>🧠 Memory Games</h2>
        <div className="games-grid">
          {memoryGames.map(game => (
            <div key={game.id} className="game-card" onClick={() => setSelectedGame(game.id)}>
              <h3>{game.name}</h3>
              <p>{game.description}</p>
              <div className="levels">10 Levels</div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default KidGames;