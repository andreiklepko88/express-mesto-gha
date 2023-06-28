const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [2, 'Must be at least 2 symbols'],
    maxlength: [30, 'Maximum 30 symbols, got {VALUE}'],
  },
  about: {
    type: String,
    required: [true, 'User information is required'],
    minlength: [2, 'Must be at least 2 symbols'],
    maxlength: [30, 'Maximum 30 symbols, got {VALUE}'],
  },
  avatar: {
    type: String,
    required: [true, 'Avatar is required'],
  },
});

module.exports = mongoose.model('user', userSchema);
