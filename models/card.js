const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Place name is required'],
    minlength: [2, 'Must be at least 2 symbols'],
    maxlength: [30, 'Maximum 30 symbols, got {VALUE}'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  link: {
    type: String,
    required: [true, 'Link is required'],
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
