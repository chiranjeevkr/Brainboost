import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Navbar />
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>🧠✨</div>
          <h1 style={{ 
            fontSize: '2.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px'
          }}>
            Welcome to BrainBoost Dashboard
          </h1>
          <p style={{ fontSize: '1.3rem', color: '#555', marginBottom: '10px' }}>
            Hello <strong>{user?.name}</strong>! 👋
          </p>
          <p style={{ fontSize: '1.1rem', color: '#777', marginBottom: '30px' }}>
            Ready to boost your brain? 🚀
          </p>
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '15px',
            color: 'white',
            marginBottom: '20px'
          }}>
            <p style={{ fontSize: '1rem', margin: 0 }}>Account Type: <strong>{user?.userType?.toUpperCase()}</strong></p>
          </div>
          
          {user?.userType === 'child' && (
            <div style={{ marginTop: '30px' }}>
              <button 
                onClick={() => navigate('/games')}
                className="btn-success"
                style={{ fontSize: '1.3rem', padding: '15px 40px' }}
              >
                🎮 Play Memory Games
              </button>
            </div>
          )}
          
          {user?.userType !== 'child' && (
            <div style={{ marginTop: '40px', padding: '30px', background: '#f8f9fa', borderRadius: '15px' }}>
              <h2 style={{ color: '#667eea', marginBottom: '15px' }}>🎮 Memory Games Coming Soon!</h2>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>We're working on exciting memory games to help boost your cognitive abilities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;