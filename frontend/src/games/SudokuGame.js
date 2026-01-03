import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SudokuGame = () => {
  const [grid, setGrid] = useState([]);
  const [solution, setSolution] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameStatus, setGameStatus] = useState('start');
  const [selectedCell, setSelectedCell] = useState(null);
  const [errors, setErrors] = useState(0);

  useEffect(() => {
    // No preview needed
  }, []);

  const generateSudoku = () => {
    // Generate a simple 4x4 Sudoku
    const solutions = [
      [[1,2,3,4],[3,4,1,2],[2,3,4,1],[4,1,2,3]],
      [[2,1,4,3],[4,3,2,1],[1,4,3,2],[3,2,1,4]],
      [[3,4,1,2],[1,2,3,4],[4,3,2,1],[2,1,4,3]],
      [[4,3,2,1],[2,1,4,3],[3,4,1,2],[1,2,3,4]],
      [[1,3,2,4],[2,4,3,1],[4,2,1,3],[3,1,4,2]]
    ];

    const sol = solutions[Math.floor(Math.random() * solutions.length)];
    setSolution(sol);

    // Remove some numbers based on level
    const cellsToRemove = 4 + level;
    const newGrid = sol.map(row => [...row]);
    let removed = 0;

    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * 4);
      const col = Math.floor(Math.random() * 4);
      if (newGrid[row][col] !== 0) {
        newGrid[row][col] = 0;
        removed++;
      }
    }

    setGrid(newGrid.map((row, i) => row.map((cell, j) => ({
      value: cell,
      isFixed: cell !== 0,
      row: i,
      col: j
    }))));
  };

  const startGame = () => {
    setScore(0);
    setErrors(0);
    setGameStatus('playing');
    generateSudoku();
  };

  const handleCellClick = (row, col) => {
    if (grid[row][col].isFixed) return;
    setSelectedCell({ row, col });
  };

  const handleNumberClick = (num) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    const newGrid = grid.map(r => r.map(c => ({ ...c })));
    newGrid[row][col].value = num;
    
    // Check if the number is correct
    if (num !== solution[row][col]) {
      setErrors(errors + 1);
    }
    
    setGrid(newGrid);

    // Check if puzzle is complete
    if (checkComplete(newGrid)) {
      const newScore = score + 1;
      setScore(newScore);
      
      if (newScore >= 3) {
        setLevel(level + 1);
        setGameStatus('win');
        saveScore(level);
      } else {
        setTimeout(() => {
          generateSudoku();
          setErrors(0);
        }, 1000);
      }
    }
    setSelectedCell(null);
  };

  const checkComplete = (currentGrid) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentGrid[i][j].value !== solution[i][j]) {
          return false;
        }
      }
    }
    return true;
  };

  const handleClear = () => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (grid[row][col].isFixed) return;
    
    const newGrid = grid.map(r => r.map(c => ({ ...c })));
    newGrid[row][col].value = 0;
    setGrid(newGrid);
    setSelectedCell(null);
  };

  const saveScore = async (finalLevel) => {
    try {
      await axios.post('/api/game-scores/save', {
        gameName: 'Sudoku',
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
        <p style={{ color: '#555', margin: '5px 0' }}>• Fill the 4x4 grid with numbers 1-4</p>
        <p style={{ color: '#555', margin: '5px 0' }}>• Each row must contain 1, 2, 3, and 4</p>
        <p style={{ color: '#555', margin: '5px 0' }}>• Each column must contain 1, 2, 3, and 4</p>
        <p style={{ color: '#555', margin: '5px 0' }}>• Gray cells are fixed and cannot be changed</p>
      </div>

      <h3>🔢 Sudoku Puzzle</h3>
      <p>Level: {level} | Score: {score}/3 | Errors: {errors}</p>

      {gameStatus === 'start' && (
        <button onClick={startGame} className="btn-primary">Start Game</button>
      )}

      {gameStatus === 'playing' && grid.length > 0 && (
        <div>
          {/* Sudoku Grid */}
          <div style={{ display: 'inline-block', marginBottom: '20px' }}>
            {grid.map((row, i) => (
              <div key={i} style={{ display: 'flex' }}>
                {row.map((cell, j) => (
                  <div
                    key={j}
                    onClick={() => handleCellClick(i, j)}
                    style={{
                      width: '60px',
                      height: '60px',
                      border: '2px solid #667eea',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      cursor: cell.isFixed ? 'not-allowed' : 'pointer',
                      background: cell.isFixed 
                        ? '#e0e0e0' 
                        : selectedCell?.row === i && selectedCell?.col === j 
                        ? '#f093fb' 
                        : 'white',
                      color: cell.isFixed ? '#666' : '#667eea'
                    }}
                  >
                    {cell.value !== 0 ? cell.value : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Number Buttons */}
          <div>
            <p style={{ marginBottom: '10px' }}>Select a number:</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '10px' }}>
              {[1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  className="btn-success"
                  style={{ fontSize: '1.5rem', padding: '15px 25px' }}
                >
                  {num}
                </button>
              ))}
            </div>
            <button onClick={handleClear} className="btn-danger">
              Clear Cell
            </button>
          </div>
        </div>
      )}

      {gameStatus === 'win' && (
        <div>
          <h2>🎉 Excellent! Level {level} Complete!</h2>
          <p>You solved {score}/3 puzzles!</p>
          <button onClick={startGame} className="btn-success">Next Level</button>
        </div>
      )}
    </div>
  );
};

export default SudokuGame;