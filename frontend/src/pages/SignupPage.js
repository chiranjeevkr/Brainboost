import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    userType: 'general'
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '2rem'
        }}>
          🎉 Sign Up
        </h2>
        
        {error && <div style={{ color: '#eb3349', marginBottom: '20px', padding: '10px', background: '#ffe0e0', borderRadius: '10px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>Account Type:</label>
            <select 
              name="userType" 
              value={formData.userType} 
              onChange={handleChange}
              style={{ width: '100%' }}
            >
              <option value="general">👤 General</option>
              <option value="parent">👨‍👩‍👧 Parent</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              name="name"
              placeholder="📝 Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              name="email"
              placeholder="📧 Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="number"
              name="age"
              placeholder="🎂 Age"
              value={formData.age}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <input
              type="password"
              name="password"
              placeholder="🔒 Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </div>

          <button type="submit" className="btn-success" style={{ width: '100%', fontSize: '1.1rem' }}>
            ✨ Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;