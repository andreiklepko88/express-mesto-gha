const mongoose = require('mongoose');
const { regexUrl } = require('../utils/constants');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value) => regexUrl.test(value),
      message: 'Avatar URL format is incorrect',
    },
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
