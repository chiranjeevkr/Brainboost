import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ChildPerformancePage = () => {
  const { childId } = useParams();
  const [childName, setChildName] = useState('');
  const [bestScores, setBestScores] = useState([]);
  const [allScores, setAllScores] = useState([]);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const response = await axios.get(`/api/game-scores/child/${childId}`);
      setChildName(response.data.childName);
      setBestScores(response.data.bestScores);
      setAllScores(response.data.allScores);
    } catch (error) {
      console.error('Failed to fetch scores');
    }
  };

  const gameIcons = {
    'Math Quiz': '🧮',
    'Number Sequence': '🔢',
    'Color Pattern': '🎨',
    'Word Memory': '📝'
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Navbar />
      <div style={{ padding: '40px 20px' }}>
        <h1 style={{ textAlign: 'center', color: 'white', marginBottom: '40px', fontSize: '2.5rem' }}>
          📊 {childName}'s Performance
        </h1>

        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="card" style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#667eea', marginBottom: '20px' }}>🌟 Best Scores</h2>
            {bestScores.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center' }}>No games played yet.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {bestScores.map((score, idx) => (
                  <div key={idx} style={{
                    padding: '20px',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    borderRadius: '15px',
                    color: 'white',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '3rem' }}>{gameIcons[score.gameName]}</div>
                    <h3 style={{ margin: '10px 0' }}>{score.gameName}</h3>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '5px 0' }}>Level {score.level}</p>
                    <p style={{ fontSize: '1rem', margin: 0 }}>Score: {score.score}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h2 style={{ color: '#667eea', marginBottom: '20px' }}>📊 Recent Games</h2>
            {allScores.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center' }}>No game history yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Game</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Level</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Score</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allScores.slice(0, 10).map((score, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>
                          <span style={{ marginRight: '8px' }}>{gameIcons[score.gameName]}</span>
                          {score.gameName}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>{score.level}</td>
                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#667eea' }}>{score.score}</td>
                        <td style={{ padding: '12px', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                          {new Date(score.playedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildPerformancePage;