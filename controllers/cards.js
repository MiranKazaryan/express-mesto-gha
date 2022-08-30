const Card = require('../models/card');
const ERRORS = require('../utils/constants');

// получение всех карточек
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
      res.status(ERRORS.INTERNAL_SERVER).send({ message: 'Error finding cards' });
    });
};
// создание карточки
const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(ERRORS.BAD_REQUEST).send({ message: 'Error validating card' });
      } else {
        res.status(ERRORS.INTERNAL_SERVER).send({ message: 'Server error' });
      }
    });
};
// удаление карточек
const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERRORS.NOT_FOUND).send({ message: 'Card not found' });
      }
      if (card.owner._id.toString() !== req.user._id) {
        res.status(ERRORS.FORBIDDEN).send({ message: 'Can not delete this card' });
      }
      return card.remove().then(() => {
        res.send({ message: 'Card deleted' });
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERRORS.BAD_REQUEST).send({ message: 'Incorrect data' });
      } else {
        res.status(ERRORS.INTERNAL_SERVER).send({ message: 'Server error' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      const error = new Error('Card not found');
      error.statusCode = ERRORS.NOT_FOUND;
      throw error;
    })
    .then((card) => {
      if (card) {
        res.status(200).send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERRORS.BAD_REQUEST).send({ message: 'Data is not correct' });
      } else if (err.statusCode === ERRORS.NOT_FOUND) {
        res.status(ERRORS.NOT_FOUND).send({ message: err.message });
      } else {
        res.status(ERRORS.INTERNAL_SERVER).send({ message: 'Server error' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      const error = new Error('Card not found');
      error.statusCode = ERRORS.NOT_FOUND;
      throw error;
    })
    .then((card) => {
      if (card) {
        res.status(200).send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERRORS.BAD_REQUEST).send({ message: 'Data is not correct' });
      } else if (err.statusCode === ERRORS.NOT_FOUND) {
        res.status(ERRORS.NOT_FOUND).send({ message: err.message });
      } else {
        res.status(ERRORS.INTERNAL_SERVER).send({ message: 'Server error' });
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
