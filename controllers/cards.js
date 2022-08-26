const Card = require("../models/card");
//получение всех карточек
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((e) => {
      res.status(500).send({ message: `Error finding cards ${e}` });
    });
};
//создание карточки
const createCard = (req, res) => {
  console.log(req.user);
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((e) => {
      if (e.name === "ValidationError") {
        res.status(400).send({ message: `Error validating card ${e}` });
      } else {
        res.status(500).send({ message: `Server error ${e}` });
      }
    });
};
//удаление карточек
const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: "Card not found" });
      }
      if (card.owner._id.toString() !== req.user._id) {
        res.status(403).send({ message: "Can't delete this card" });
      }
      return card.remove().then(() => {
        res.send({ message: "Card deleted" });
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: "Incorrect date" });
      } else {
        res.status(500).send({ message: "Server error" });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Card not found");
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      console.log(card);
      if (card) {
        res.status(200).send({ card });
      }
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(400).send({ message: "Data isn't correct" });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: "Server error" });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Card not found");
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      if (card) {
        res.status(200).send({ card });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(400).send({ message: "Data isn't correct" });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: "Server error" });
      }
    });
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
