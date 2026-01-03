import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '60px 40px',
        borderRadius: '30px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        maxWidth: '800px',
        animation: 'fadeIn 1s ease-in'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <span style={{ fontSize: '80px' }}>🧠</span>
        </div>
        <h1 style={{ 
          fontSize: '3.5rem', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          Welcome to BrainBoost
        </h1>
        <h2 style={{ fontSize: '1.8rem', color: '#555', marginBottom: '30px' }}>
          Web Application World
        </h2>
        <p style={{ fontSize: '1.3rem', color: '#666', marginBottom: '50px', lineHeight: '1.6' }}>
          🎮 This will help you to boost your brain by doing fun! 🚀
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
          <Link 
            to="/signup" 
            className="btn-success"
            style={{
              textDecoration: 'none',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            🎯 Sign Up
          </Link>
          <Link 
            to="/login" 
            className="btn-primary"
            style={{
              textDecoration: 'none',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            🔐 Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;