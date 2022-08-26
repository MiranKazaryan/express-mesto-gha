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
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((e) =>
      res.status(500).send({ message: `Error creating user ${e}` })
    );
};
//удаление карточек
const deleteCard = (req, res) => {
  console.log(req.params.id);
  Card.findById(req.params.id)
    .orFail(() => {
      throw new Error("Card not found");
    })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: `Error getting card ${e}` });
      }
      if (card.owner._id.toString() !== req.user._id) {
        res.status(401).send("You can delete only your cards");
      }
      Card.findByIdAndRemove(req.params.id)
        .then((card) => res.status(200).send(card))
        .catch((err) => res.status(500).send({ message: "Server error" }));
    });
};

const likeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: "Card not found" });
        } else {
          res.status(200).send({ card });
        }
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          res.status(400).send({ message: "Data isn't correct" });
        }
        res.status(500).send({ message: "Server error" });
      })
  );

const dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: "Card not found" });
        } else {
          res.status(200).send({ card });
        }
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          res.status(400).send({ message: "Data isn't correct" });
        }
        res.status(500).send({ message: "Server error" });
      })
  );

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
