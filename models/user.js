const mongoose = require('mongoose');
const validator = require('validator');
const { regexUrl } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
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
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Email format is incorrect',
    },
    index: true,
  },
  password: {
    select: false,
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
