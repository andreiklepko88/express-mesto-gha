const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexUrl } = require('../utils/constants');

const {
  getUsers, getUserById, updateProfile, updateAvatar, getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getUserInfo);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regexUrl).required(),
  }),
}), updateAvatar);

module.exports = router;
