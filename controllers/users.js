const User = require("../models/user");
//получение данных о пользователях
const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch((e) => res.status(500).send({ message: `Error finding user ` }));
};
//получение данных о пользователе
const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error("User with id isn't found");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      }
    })
    .catch((e) => {
      if (e.name === "CastError") {
        res.status(400).send({ message: `Uncorrect data ` });
      } else if (e.statusCode === 404) {
        res.status(404).send({message: e.message});
      } else {
        res.status(500).send({ message: `Server error ` });
      }
    });
};
//создание пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((e) => {
      if (e.name === "ValidationError") {
        res.status(400).send({ message: `Error validating user ` });
      } else {
        res.status(500).send({ message: `Server error` });
      }
    });
};
//обновление данных профиля
const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: `Error updating user profile data ` });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        res.status(400).send({ message: `Error validating profile data ` });
      } else {
        res.status(500).send({ message: `Server error` });
      }
    });
};
//обновление аватара
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: `Error updating user avatar` });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        res.status(400).send({ message: `Error validating avatar data ` });
      } else {
        res.status(500).send({ message: `Server error ` });
      }
    });
};

module.exports = { getUser, getUsers, createUser, updateProfile, updateAvatar };
