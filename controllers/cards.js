const Card = require('../models/card');
const ERRORS = require('../utils/constants');

// получение всех карточек
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((e) => {
      next(e);
    });
};
// создание карточки
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(ERRORS.BAD_REQUEST).send({ message: 'Error validating card' });
      } else {
        next(e);
      }
    });
};
// удаление карточек
const deleteCard = (req, res, next) => {
  console.log('req', req.params);
  Card.findById(req.params.cardId)
    .then((card) => {
      console.log(card);
      if (!card) {
        return res.status(ERRORS.NOT_FOUND).send({ message: 'Card not found' });
      }
      if (card.owner._id.toString() !== req.user._id) {
        return res.status(ERRORS.FORBIDDEN).send({ message: 'Can not delete this card' });
      }
      return card.remove().then(() => {
        res.send({ message: 'Card deleted' });
      });
    })
    .catch((err) => {
      console.log('err',err.name);
      //console.log(err);
      if (err.name === 'CastError' || req.user === undefined) {
        res.status(ERRORS.BAD_REQUEST).send({ message: 'Incorrect data' });
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  console.log(req.params.cardId);
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
      console.log(card);
      if (card) {
        res.status(200).send({ card });
      }
    })
    .catch((err) => {

      if (err.name === 'CastError' || req.user === undefined) {
        res.status(ERRORS.BAD_REQUEST).send({ message: 'Data is not correct' });
      } else if (err.statusCode === ERRORS.NOT_FOUND) {
        res.status(ERRORS.NOT_FOUND).send({ message: err.message });
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
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
      if (err.name === 'CastError' || req.user === undefined) {
        res.status(ERRORS.BAD_REQUEST).send({ message: 'Data is not correct' });
      } else if (err.statusCode === ERRORS.NOT_FOUND) {
        res.status(ERRORS.NOT_FOUND).send({ message: err.message });
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
