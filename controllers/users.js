const User = require('../models/user');
const ERRORS = require('../utils/constants');

// получение данных о пользователях
const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch(() => res.status(ERRORS.INTERNAL_SERVER).send({ message: 'Error finding user ' }));
};
// получение данных о пользователе
const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error('User with id is not found');
      error.statusCode = ERRORS.NOT_FOUND;
      throw error;
    })
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      }
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        res.status(ERRORS.BAD_REQUEST).send({ message: 'Uncorrect data ' });
      } else if (e.statusCode === ERRORS.NOT_FOUND) {
        res.status(ERRORS.NOT_FOUND).send({ message: e.message });
      } else {
        res.status(ERRORS.INTERNAL_SERVER).send({ message: 'Server error ' });
      }
    });
};
// создание пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(ERRORS.BAD_REQUEST).send({ message: 'Error validating user ' });
      } else {
        res.status(ERRORS.INTERNAL_SERVER).send({ message: 'Server error' });
      }
    });
};
// обновление данных профиля
const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(ERRORS.NOT_FOUND)
          .send({ message: 'User is not found ' });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(ERRORS.BAD_REQUEST).send({ message: 'Error validating profile data ' });
      } else {
        res.status(ERRORS.INTERNAL_SERVER).send({ message: 'Server error' });
      }
    });
};
// обновление аватара
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(ERRORS.NOT_FOUND).send({ message: 'User is not found' });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(ERRORS.BAD_REQUEST).send({ message: 'Error validating avatar data ' });
      } else {
        res.status(ERRORS.INTERNAL_SERVER).send({ message: 'Server error ' });
      }
    });
};

module.exports = {
  getUser, getUsers, createUser, updateProfile, updateAvatar,
};
