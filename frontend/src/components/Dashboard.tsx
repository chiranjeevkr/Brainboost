import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🧠 BrainBoost</h1>
        <div className="user-info">
          <span>Welcome, {user.username}!</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      
      <div className="dashboard-content">
        <h2>{user.mode === 'kid' ? '🎮 Kids Zone' : '🎯 Adult Training'}</h2>
        
        <div className="dashboard-grid">
          <Link to="/games" className="dashboard-card games">
            <h3>🎮 Games</h3>
            <p>{user.mode === 'kid' ? '6 Fun Games' : '6 Brain Games'}</p>
          </Link>
          
          <Link to="/puzzle" className="dashboard-card puzzle">
            <h3>🧩 AI Puzzles</h3>
            <p>Generate custom puzzles</p>
          </Link>
          
          <Link to="/iq-test" className="dashboard-card iq">
            <h3>🧠 IQ Test</h3>
            <p>Test your intelligence</p>
          </Link>
          
          <Link to="/progress" className="dashboard-card progress">
            <h3>📊 Progress</h3>
            <p>Track your improvement</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;