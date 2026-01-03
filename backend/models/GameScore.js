const mongoose = require('mongoose');

const gameScoreSchema = new mongoose.Schema({
  child: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
  gameName: { type: String, required: true, enum: ['Math Quiz', 'Number Sequence', 'Color Pattern', 'Word Memory', 'Sudoku'] },
  score: { type: Number, required: true },
  level: { type: Number, required: true },
  playedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('GameScore', gameScoreSchema);