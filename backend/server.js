const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const childrenRoutes = require('./routes/children');
const gameScoresRoutes = require('./routes/gameScores');
const aiChatRoutes = require('./routes/aiChat');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/game-scores', gameScoresRoutes);
app.use('/api/ai', aiChatRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});