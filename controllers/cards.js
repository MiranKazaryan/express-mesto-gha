const Card = require('../models/card');
const BAD_REQUEST = require('../errors/BadRequesError');
const NOT_FOUND = require('../errors/NotFoundError');
const FORBIDDEN = require('../errors/ForbiddenError');

// получение всех карточек
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};
// создание карточки
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BAD_REQUEST('Error validating card'));
      } else {
        next(e);
      }
    });
};
// удаление карточек
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NOT_FOUND('Card not found');
    })
    .then((card) => {
      if (card.owner._id.toString() !== req.user._id) {
        throw new FORBIDDEN('Can not delete this card');
      }
      return card.remove().then(() => {
        res.send({ message: 'Card deleted' });
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BAD_REQUEST('Data is not correct'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NOT_FOUND('Card not found');
    })
    .then((card) => {
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BAD_REQUEST('Data is not correct'));
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
      throw new NOT_FOUND('Card not found');
    })
    .then((card) => {
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BAD_REQUEST('Data is not correct'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
