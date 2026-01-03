import React, { useState, useEffect } from 'react';

const MemoryCardGame = () => {
  const emojis = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🍒', '🍑'];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (showPreview && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showPreview && countdown === 0) {
      setShowPreview(false);
    }
  }, [showPreview, countdown]);

  const initGame = () => {
    const shuffled = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setShowPreview(true);
    setCountdown(10);
  };

  const handleClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '10px' }}>
        <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>🎯 How to Play:</h4>
        <p style={{ color: '#555', margin: 0 }}>Memorize all card positions in 10 seconds, then click cards to find matching pairs!</p>
      </div>

      {showPreview && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#f5576c' }}>Memorize the cards! {countdown}s</h2>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3>🎴 Memory Card Match</h3>
        <div>Moves: {moves}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
        {cards.map((emoji, index) => (
          <div
            key={index}
            onClick={() => !showPreview && handleClick(index)}
            style={{
              width: '80px',
              height: '80px',
              background: showPreview || flipped.includes(index) || matched.includes(index) ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#ddd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              borderRadius: '10px',
              cursor: showPreview ? 'default' : 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {(showPreview || flipped.includes(index) || matched.includes(index)) ? emoji : '?'}
          </div>
        ))}
      </div>
      {matched.length === cards.length && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h2>🎉 You Won! Moves: {moves}</h2>
          <button onClick={initGame} className="btn-success">Play Again</button>
        </div>
      )}
    </div>
  );
};

export default MemoryCardGame;