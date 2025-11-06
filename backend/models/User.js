const mongoose = require('mongoose');

const gameProgressSchema = new mongoose.Schema({
  gameId: String,
  level: { type: Number, default: 1 },
  score: { type: Number, default: 0 },
  completed: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  mode: { type: String, enum: ['kid', 'adult'], required: true },
  iqScore: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  badges: [String],
  gameProgress: [gameProgressSchema],
  createdAt: { type: Date, default: Date.now }
});

userSchema.index({ username: 1, email: 1, mode: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);