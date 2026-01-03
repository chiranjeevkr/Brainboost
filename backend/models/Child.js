const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const childSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPaused: { type: Boolean, default: false }
}, { timestamps: true });

childSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

childSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Child', childSchema);