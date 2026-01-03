import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1.2rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
    }}>
      <Link to="/dashboard" style={{ 
        color: 'white', 
        textDecoration: 'none', 
        fontSize: '1.8rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span>🧠</span> BrainBoost
      </Link>
      
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <Link to="/profile" style={{ 
          color: 'white', 
          textDecoration: 'none',
          fontSize: '1.1rem',
          fontWeight: '500',
          transition: 'all 0.3s ease',
          padding: '8px 16px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.1)'
        }}>
          👤 Profile
        </Link>
        {user?.userType === 'parent' && (
          <Link to="/children" style={{ 
            color: 'white', 
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: '500',
            padding: '8px 16px',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.1)'
          }}>
            👶 Children
          </Link>
        )}
        {user?.userType === 'child' && (
          <Link to="/leaderboard" style={{ 
            color: 'white', 
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: '500',
            padding: '8px 16px',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.1)'
          }}>
            🏆 Leaderboard
          </Link>
        )}
        {user?.userType === 'child' && (
          <Link to="/ai-chat" style={{ 
            color: 'white', 
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: '500',
            padding: '8px 16px',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.1)'
          }}>
            🤖 AI Chat
          </Link>
        )}
        <span style={{ 
          color: 'white',
          fontSize: '1rem',
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '8px 16px',
          borderRadius: '20px'
        }}>
          Welcome, {user?.name} 👋
        </span>
        <button 
          onClick={logout}
          className="btn-danger"
          style={{ fontSize: '1rem' }}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;