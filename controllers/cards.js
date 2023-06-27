/* eslint-disable arrow-body-style */
const Card = require('../models/card');
const {
  OK_CODE, CREATED_CODE, BAD_REQUEST_CODE, NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
} = require('../utils/constants');

const getCards = (req, res) => {
  return Card.find({})
    .then((cards) => {
      if (!cards) {
        res.status(NOT_FOUND_CODE).send({ message: 'Not found' });
        return;
      }
      res.status(OK_CODE).send(cards);
    })
    .catch((err) => {
      res.status(SERVER_ERROR_CODE).send({ message: err.message });
    });
};

const createCard = (req, res) => {
  const newCardData = req.body;
  newCardData.owner = req.user._id;
  return Card.create(newCardData).then(
    (newCard) => {
      res.status(CREATED_CODE).send(newCard);
    },
  ).catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_CODE)
        .send({ message: `${Object.values(err.errors).map((error) => error.message).join('. ')}` });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Server error' });
  });
};

const deleteCard = (req, res) => {
  return Card.findOneAndDelete({ _id: req.params.cardId }).then(
    (card) => {
      if (!card) {
        return res.status(NOT_FOUND_CODE).send({ message: 'Card not found' });
      }
      return res.status(OK_CODE).send({ message: 'Card deleted' });
    },
  ).catch((err) => {
    if (!req.params.cardId.isValid) {
      res.status(BAD_REQUEST_CODE).send({ message: 'Incorrect Id number' });
    } else {
      res.status(SERVER_ERROR_CODE).send({ message: err.message });
    }
  });
};

const likeCard = (req, res) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Incorrect Id number' });
    }
    return res.status(OK_CODE).send({ message: 'Like added' });
  })
    .catch((err) => {
      if (!req.params.cardId.isValid) {
        res.status(BAD_REQUEST_CODE).send({ message: 'Incorrect Id number' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: err.message });
      }
    });
};

const dislikeCard = (req, res) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      return res.status(BAD_REQUEST_CODE).send({ message: 'Incorrect Id number' });
    }
    return res.status(OK_CODE).send({ message: 'Like removed' });
  })
    .catch((err) => {
      if (!req.params.cardId.isValid) {
        res.status(BAD_REQUEST_CODE).send({ message: 'Incorrect Id number' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: err.message });
      }
    });
};

module.exports = {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
};
