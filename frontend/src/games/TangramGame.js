import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TangramGame = () => {
  const [targetShape, setTargetShape] = useState('');
  const [pieces, setPieces] = useState([]);
  const [placedPieces, setPlacedPieces] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameStatus, setGameStatus] = useState('start');
  const [showPreview, setShowPreview] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const shapes = [
    { name: 'Square', icon: '🟦', pieces: ['▲', '▲', '▲', '▲'] },
    { name: 'Triangle', icon: '🔺', pieces: ['▲', '▲', '▲'] },
    { name: 'House', icon: '🏠', pieces: ['▲', '▲', '▲', '■'] },
    { name: 'Cat', icon: '🐱', pieces: ['▲', '▲', '▲', '▲', '■'] },
    { name: 'Boat', icon: '⛵', pieces: ['▲', '▲', '▲', '■'] },
    { name: 'Fish', icon: '🐟', pieces: ['▲', '▲', '▲', '▲'] }
  ];

  useEffect(() => {
    if (showPreview && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showPreview && countdown === 0) {
      setShowPreview(false);
    }
  }, [showPreview, countdown]);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setGameStatus('playing');
    generatePuzzle();
  };

  const generatePuzzle = () => {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    setTargetShape(shape);
    setPieces(shape.pieces.map((p, i) => ({ id: i, shape: p, placed: false })));
    setPlacedPieces([]);
    setShowPreview(true);
    setCountdown(10);
  };

  const handlePieceClick = (piece) => {
    if (piece.placed) return;
    setSelectedPiece(piece);
  };

  const handlePlacePiece = () => {
    if (!selectedPiece) return;
    
    const newPlaced = [...placedPieces, selectedPiece];
    setPlacedPieces(newPlaced);
    
    const newPieces = pieces.map(p => 
      p.id === selectedPiece.id ? { ...p, placed: true } : p
    );
    setPieces(newPieces);
    setSelectedPiece(null);

    if (newPlaced.length === targetShape.pieces.length) {
      const newScore = score + 1;
      setScore(newScore);
      
      if (newScore >= 5) {
        setLevel(level + 1);
        setGameStatus('win');
        saveScore(level);
      } else {
        setTimeout(() => generatePuzzle(), 1500);
      }
    }
  };

  const handleReset = () => {
    setPieces(pieces.map(p => ({ ...p, placed: false })));
    setPlacedPieces([]);
    setSelectedPiece(null);
  };

  const saveScore = async (finalLevel) => {
    try {
      await axios.post('/api/game-scores/save', {
        gameName: 'Tangram Puzzle',
        score: finalLevel * 10 + score * 5,
        level: finalLevel
      });
    } catch (error) {
      console.error('Failed to save score');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ marginBottom: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '10px', textAlign: 'left' }}>
        <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>🎯 How to Play:</h4>
        <p style={{ color: '#555', margin: 0 }}>Study the shape for 10 seconds, then arrange the pieces to recreate it! Complete 5 puzzles to advance!</p>
      </div>

      <h3>🧩 Tangram Puzzle</h3>
      <p>Level: {level} | Score: {score}/5</p>

      {gameStatus === 'start' && (
        <button onClick={startGame} className="btn-primary">Start Game</button>
      )}

      {showPreview && (
        <div>
          <h2 style={{ color: '#f5576c', marginBottom: '20px' }}>Memorize this shape! {countdown}s</h2>
          <div style={{ 
            fontSize: '8rem', 
            margin: '30px 0',
            padding: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            color: 'white'
          }}>
            {targetShape.icon}
          </div>
          <h3 style={{ color: '#667eea' }}>{targetShape.name}</h3>
        </div>
      )}

      {gameStatus === 'playing' && !showPreview && (
        <div>
          <div style={{ marginBottom: '30px' }}>
            <h3>Target: {targetShape.name} {targetShape.icon}</h3>
          </div>

          {/* Placement Area */}
          <div style={{
            minHeight: '200px',
            border: '3px dashed #667eea',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '30px',
            background: '#f8f9fa',
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {placedPieces.length === 0 ? (
              <p style={{ color: '#999' }}>Click pieces below, then click here to place them</p>
            ) : (
              placedPieces.map((piece, idx) => (
                <div key={idx} style={{ fontSize: '3rem', color: '#667eea' }}>
                  {piece.shape}
                </div>
              ))
            )}
          </div>

          {selectedPiece && (
            <button 
              onClick={handlePlacePiece}
              className="btn-success"
              style={{ marginBottom: '20px' }}
            >
              Place Piece ✓
            </button>
          )}

          {/* Available Pieces */}
          <div>
            <h4>Available Pieces:</h4>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
              {pieces.filter(p => !p.placed).map((piece) => (
                <button
                  key={piece.id}
                  onClick={() => handlePieceClick(piece)}
                  style={{
                    padding: '20px',
                    fontSize: '3rem',
                    background: selectedPiece?.id === piece.id 
                      ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                      : 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                    color: 'white',
                    border: selectedPiece?.id === piece.id ? '3px solid #fff' : 'none',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    transform: selectedPiece?.id === piece.id ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.3s'
                  }}
                >
                  {piece.shape}
                </button>
              ))}
            </div>

            <button onClick={handleReset} className="btn-danger">
              Reset Puzzle
            </button>
          </div>
        </div>
      )}

      {gameStatus === 'win' && (
        <div>
          <h2>🎉 Amazing! Level {level} Complete!</h2>
          <p>You solved {score}/5 puzzles!</p>
          <button onClick={startGame} className="btn-success">Next Level</button>
        </div>
      )}
    </div>
  );
};

export default TangramGame;