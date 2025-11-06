import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CreativityGame from './CreativityGame';

const AdultGames: React.FC = () => {
  const [showGame, setShowGame] = useState(false);

  if (showGame) {
    return <CreativityGame onBack={() => setShowGame(false)} />;
  }

  return (
    <div className="games-page">
      <header className="games-header">
        <h1>🎯 Adult Brain Training</h1>
        <div className="nav-menu">
          <Link to="/puzzle" className="nav-btn">🧩 Puzzles</Link>
          <Link to="/iq-test" className="nav-btn">🧠 IQ Test</Link>
          <Link to="/progress" className="nav-btn">📊 Progress</Link>
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="nav-btn">Logout</button>
        </div>
      </header>
      
      <div className="games-section">
        <h2>🎨 Creative Thinking Game</h2>
        <div className="games-grid">
          <div className="game-card" onClick={() => setShowGame(true)}>
            <h3>💡 Pattern Creator</h3>
            <p>Create unique patterns and unlock creativity</p>
            <div className="levels">10 Levels</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdultGames;