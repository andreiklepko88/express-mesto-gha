const User = require('../models/user');
const { OK_CODE, CREATED_CODE, BAD_REQUEST_CODE,
   NOT_FOUND_CODE, SERVER_ERROR_CODE } = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
      res.status(NOT_FOUND_CODE).send({ message: 'Not found' });
      return;
    }
    res.status(OK_CODE).send(users);
    })
  .catch((err) => {
    res.status(SERVER_ERROR_CODE).send({ message: 'Server error' });
  });
};

const getUserById = (req, res) => {
  const { id } = req.params;
  return User.findById(id)
  .then((user) => {
    if (!user) {
      res.status(NOT_FOUND_CODE).send({ message: 'Not found' });
      return;
    }
    return res.status(OK_CODE).send(user);
  })
  .catch((err) => {
    return res.status(SERVER_ERROR_CODE).send({ message: 'Server error'});
  });
};

const createUser = (req, res) => {
  const newUserData = req.body;
  return User.create(newUserData)
  .then((newUser) => {
    res.status(CREATED_CODE).send(newUser);
    return;
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_CODE)
      .send({ message: `${Object.values(err.errors).map((error) => error.message).join('. ')}`});
    }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Server error'});
  });
};

const updateProfile = (req, res) => {
  const {name, about} = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    {name, about},
    {runValidators: true})
  .then((user) => {
    if (!user) {
      res.status(NOT_FOUND_CODE).send({ message: 'Not found' });
      return;
    }
    return res.status(OK_CODE).send({ message: 'User updated'});
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_CODE)
      .send({ message: `${Object.values(err.errors).map((error) => error.message).join('. ')}`});
    }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Server error'});
  });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    req.body,
    { runValidators: true })
  .then((user) => {
    if (!user) {
      res.status(NOT_FOUND_CODE).send({ message: 'Not found' });
      return;
    }
    return res.status(OK_CODE).send({ message: 'Avatar updated'});
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_CODE)
      .send({ message: `${Object.values(err.errors).map((error) => error.message).join('. ')}`});
    }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Server error'});
  });
};

module.exports = {
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
};
