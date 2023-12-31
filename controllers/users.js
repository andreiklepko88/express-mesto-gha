/* eslint-disable arrow-body-style */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const {
  OK_CODE, CREATED_CODE, saltRounds, JWT_SECRET,
} = require('../utils/constants');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Not found');
      }
      res.status(OK_CODE).send(users);
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  return User.findById({ _id: req.user.id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      res.status(OK_CODE).send(user);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  return User.findById({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('User not found'));
      } else {
        res.status(OK_CODE).send(user);
      }
    }).catch((err) => {
      if (!req.params.userId.isValid) {
        next(new BadRequestError('Incorrect Id number'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    email, password, avatar, about, name,
  } = req.body;
  bcrypt.hash(password, saltRounds)
    .then((hash) => User.create({
      avatar,
      about,
      name,
      email,
      password: hash,
    }))
    .then((createdUser) => {
      res.status(CREATED_CODE).send({
        _id: createdUser._id,
        name: createdUser.name,
        about: createdUser.about,
        email: createdUser.email,
        avatar: createdUser.avatar,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('User already exists'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('not valid'));
        return;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Wrong email or password'));
      }
      return bcrypt.compare(password, user.password)
        .then((isPasswordMatch) => {
          if (!isPasswordMatch) {
            return Promise.reject(new UnauthorizedError('Password or email is not correct'));
          }
          const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
          return res.status(OK_CODE).send({ token });
        });
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  return User.findByIdAndUpdate(
    req.user.id,
    req.body,
    {
      runValidators: true,
      new: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Not found');
      }
      res.status(OK_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join('. ')}`));
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
  return User.findByIdAndUpdate(
    req.user.id,
    req.body,
    {
      runValidators: true,
      new: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Not found');
      }
      res.status(OK_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join('. ')}`));
      }
      return next(err);
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateProfile, updateAvatar, login, getUserInfo,
};
