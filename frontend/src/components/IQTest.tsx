import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

const IQTest: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [iqScore, setIqScore] = useState(0);

  const questions: Question[] = [
    {
      id: 1,
      question: "What comes next in the sequence: 2, 4, 8, 16, ?",
      options: ["24", "32", "20", "18"],
      correct: 1
    },
    {
      id: 2,
      question: "If all roses are flowers and some flowers are red, which statement is true?",
      options: ["All roses are red", "Some roses might be red", "No roses are red", "All flowers are roses"],
      correct: 1
    },
    {
      id: 3,
      question: "What is the missing number: 3, 7, 15, 31, ?",
      options: ["47", "63", "55", "71"],
      correct: 1
    },
    {
      id: 4,
      question: "Which word doesn't belong: Apple, Banana, Carrot, Orange",
      options: ["Apple", "Banana", "Carrot", "Orange"],
      correct: 2
    },
    {
      id: 5,
      question: "If you rearrange the letters 'CIFAIPC', you get:",
      options: ["PACIFIC", "TRAFFIC", "CLASSIC", "PLASTIC"],
      correct: 0
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateIQ(newAnswers);
    }
  };

  const calculateIQ = async (userAnswers: number[]) => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correct) correct++;
    });

    const percentage = (correct / questions.length) * 100;
    const calculatedIQ = Math.round(85 + (percentage / 100) * 30); // Scale to 85-115 range
    
    setIqScore(calculatedIQ);
    setShowResult(true);

    // Save IQ score to backend
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://brainboost-16cb.onrender.com/api/games/iq', 
        { score: calculatedIQ },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Failed to save IQ score');
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setIqScore(0);
  };

  if (showResult) {
    return (
      <div className="iq-test-page">
        <header className="test-header">
          <Link to="/games" className="back-btn">← Back to Games</Link>
          <h1>🧠 IQ Test Results</h1>
        </header>

        <div className="result-container">
          <div className="iq-score-display">
            <h2>Your IQ Score</h2>
            <div className="score-circle">
              <span className="score-number">{iqScore}</span>
            </div>
          </div>

          <div className="score-interpretation">
            <h3>Score Interpretation:</h3>
            <div className="interpretation-text">
              {iqScore >= 130 && "🌟 Exceptional! You're in the top 2% of the population."}
              {iqScore >= 115 && iqScore < 130 && "🎯 Above Average! Great cognitive abilities."}
              {iqScore >= 85 && iqScore < 115 && "✅ Average Range. Good problem-solving skills."}
              {iqScore < 85 && "💪 Keep practicing! Brain training will help improve your score."}
            </div>
          </div>

          <div className="result-actions">
            <button onClick={resetTest} className="retake-btn">
              🔄 Retake Test
            </button>
            <Link to="/games" className="train-btn">
              🎮 Train Your Brain
            </Link>
          </div>

          <div className="score-breakdown">
            <h3>Question Breakdown:</h3>
            {questions.map((q, index) => (
              <div key={q.id} className={`question-result ${answers[index] === q.correct ? 'correct' : 'incorrect'}`}>
                <p>Q{index + 1}: {answers[index] === q.correct ? '✅' : '❌'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="iq-test-page">
      <header className="test-header">
        <Link to="/games" className="back-btn">← Back to Games</Link>
        <h1>🧠 IQ Test</h1>
      </header>

      <div className="test-container">
        <div className="progress-indicator">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="question-container">
          <h2>{questions[currentQuestion].question}</h2>
          
          <div className="options-grid">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className="option-btn"
                onClick={() => handleAnswer(index)}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>
        </div>

        <div className="test-info">
          <p>💡 Take your time and think carefully about each question.</p>
          <p>🎯 This test measures logical reasoning and pattern recognition.</p>
        </div>
      </div>
    </div>
  );
};

export default IQTest;