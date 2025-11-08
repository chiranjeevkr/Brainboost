import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface GameProgress {
  gameId: string;
  level: number;
  score: number;
  completed: boolean;
}

interface ProgressData {
  gameProgress: GameProgress[];
  totalScore: number;
  iqScore: number;
  badges: string[];
}

const Progress: React.FC = () => {
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://brainboost-16cb.onrender.com/api/games/progress', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgress(response.data);
    } catch (error) {
      console.error('Failed to fetch progress');
    }
  };

  if (!progress) {
    return <div className="loading">Loading progress...</div>;
  }

  return (
    <div className="progress-page">
      <header className="progress-header">
        <Link to="/games" className="back-btn">← Back to Games</Link>
        <h1>📊 Your Progress</h1>
      </header>

      <div className="progress-stats">
        <div className="stat-card">
          <h3>🏆 Total Score</h3>
          <div className="stat-value">{progress.totalScore}</div>
        </div>
        
        <div className="stat-card">
          <h3>🧠 IQ Score</h3>
          <div className="stat-value">{progress.iqScore || 'Not tested'}</div>
        </div>
        
        <div className="stat-card">
          <h3>🎮 Games Played</h3>
          <div className="stat-value">{progress.gameProgress.length}</div>
        </div>
        
        <div className="stat-card">
          <h3>🏅 Badges Earned</h3>
          <div className="stat-value">{progress.badges.length}</div>
        </div>
      </div>

      <div className="progress-details">
        <h2>Game Progress</h2>
        <div className="games-progress">
          {progress.gameProgress.map((game, index) => (
            <div key={index} className="game-progress-card">
              <h4>{game.gameId.replace('-', ' ').toUpperCase()}</h4>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(game.level / 10) * 100}%` }}
                ></div>
              </div>
              <p>Level {game.level}/10 • Score: {game.score}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="badges-section">
        <h2>🏅 Achievements</h2>
        <div className="badges-grid">
          {progress.badges.length > 0 ? (
            progress.badges.map((badge, index) => (
              <div key={index} className="badge">
                🏅 {badge}
              </div>
            ))
          ) : (
            <p>No badges earned yet. Keep playing to unlock achievements!</p>
          )}
        </div>
      </div>

      <div className="progress-chart">
        <h2>📈 Performance Trend</h2>
        <div className="chart-placeholder">
          <p>Score progression chart would be displayed here</p>
          <div className="mock-chart">
            {[20, 35, 45, 60, 75, 85, 95].map((height, index) => (
              <div 
                key={index} 
                className="chart-bar" 
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;