import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import KidGames from './components/KidGames';
import AdultGames from './components/AdultGames';
import Progress from './components/Progress';
import IQTest from './components/IQTest';
import PuzzleGenerator from './components/PuzzleGenerator';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userMode, setUserMode] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAuthenticated(!!token);
    setUserMode(user.mode || '');
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} setMode={setUserMode} /> : <Navigate to="/games" />} />
          <Route path="/register" element={!isAuthenticated ? <Register setAuth={setIsAuthenticated} setMode={setUserMode} /> : <Navigate to="/games" />} />
          <Route path="/games" element={isAuthenticated ? (userMode === 'kid' ? <KidGames /> : <AdultGames />) : <Navigate to="/login" />} />
          <Route path="/progress" element={isAuthenticated ? <Progress /> : <Navigate to="/login" />} />
          <Route path="/iq-test" element={isAuthenticated ? <IQTest /> : <Navigate to="/login" />} />
          <Route path="/puzzle" element={isAuthenticated ? <PuzzleGenerator /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/games" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;