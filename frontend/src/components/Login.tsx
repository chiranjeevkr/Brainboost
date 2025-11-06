import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

interface LoginProps {
  setAuth: (auth: boolean) => void;
  setMode: (mode: string) => void;
}

const Login: React.FC<LoginProps> = ({ setAuth, setMode }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mode: 'adult'
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setAuth(true);
      setMode(response.data.user.mode);
      navigate('/games');
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Login failed. Please check if backend is running.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🧠 BrainBoost Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <select
            value={formData.mode}
            onChange={(e) => setFormData({...formData, mode: e.target.value})}
          >
            <option value="adult">Adult Mode</option>
            <option value="kid">Kid Mode</option>
          </select>
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;