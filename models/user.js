const mongoose = require('mongoose');
const validator = require('validator');
const { regexUrl } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Must be at least 2 symbols'],
    maxlength: [30, 'Maximum 30 symbols, got {VALUE}'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Must be at least 2 symbols'],
    maxlength: [30, 'Maximum 30 symbols, got {VALUE}'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (value) => regexUrl.test(value),
      message: 'Avatar URL format is incorrect',
    },
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Email format is incorrect',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
