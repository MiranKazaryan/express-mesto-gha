const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.delete('/:cardId', celebrate({ params: Joi.object().keys({ userId: Joi.string().required().min(24).max(24) }) }), deleteCard);
cardRouter.post('/', celebrate({ body: Joi.object().keys({ name: Joi.string().required().min(2).max(30), link: Joi.string().required().pattern(/(http(s)?:\/\/)?(www\.)?[A-Za-zА-Яа-я0-9-]*\.[A-Za-zА-Яа-я0-9-]{2,8}(\/?[\wа-яА-Я#!:.?+=&%@!_~[\]$'*+,;=()-]*)*/) }) }), createCard);
cardRouter.put('/:cardId/likes', celebrate({ params: Joi.object().keys({ userId: Joi.string().required().min(24).max(24) }) }), likeCard);
cardRouter.delete('/:cardId/likes', celebrate({ params: Joi.object().keys({ userId: Joi.string().required().min(24).max(24) }) }), dislikeCard);

module.exports = cardRouter;
