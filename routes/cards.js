const cardRouter = require('express').Router();
const {getCards, createCard, deleteCard, likeCard, dislikeCard} = require('../controllers/cards');
cardRouter.get('/',getCards);
cardRouter.delete('/:id',deleteCard);
cardRouter.post('/',createCard);
cardRouter.put('/:id/likes',likeCard);
cardRouter.delete('/:id/likes',dislikeCard);

module.exports = cardRouter;