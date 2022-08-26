const User = require("../models/user");
//получение данных о пользователях
const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch((e) => res.status(500).send({ message: `Error finding user ${e}` }));
};
//получение данных о пользователе
const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error(
        "User with id isn't found"
      );
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
        res.status(400).send({ message: `Uncorrect data ${e}` });
      } else {
        res.status(500).send({ message: `Server error ${e}` });
      }
    });
};
//создание пользователя
const createUser = (req, res) => {
  console.log(req);
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((e) => {
      if (e.name === "ValidationError") {
        res.status(400).send({ message: `Error validating user ${e}` });
      } else {
        res.status(500).send({ message: `Server error ${e}` });
      }
    });
};
//обновление данных профиля
const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about },{ new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: `Error updating user profile data ${e}` });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        res.status(400).send({ message: `Error validating profile data ${e}` });
      } else {
        res.status(500).send({ message: `Server error ${e}` });
      }
    });
};
//обновление аватара
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar },{ new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: `Error updating user avatar ${e}` });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        res.status(400).send({ message: `Error validating avatar data ${e}` });
      } else {
        res.status(500).send({ message: `Server error ${e}` });
      }
    });
};

module.exports = { getUser, getUsers, createUser, updateProfile, updateAvatar };
