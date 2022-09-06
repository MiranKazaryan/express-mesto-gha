const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BAD_REQUEST = require('../errors/BadRequesError');
const NOT_FOUND = require('../errors/NotFoundError');
const CONFLICT_ERROR = require('../errors/ConflictError');

const SECRET_KEY = 'super-strong-secret';

// получение данных о пользователях
const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch(next);
};
// получение данных о пользователе
const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NOT_FOUND('User with id is not found');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BAD_REQUEST('Uncorrect data'));
      } else {
        next(e);
      }
    });
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NOT_FOUND('User is not found');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send(user.deletePasswordFromUser());
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BAD_REQUEST('Error validating user'));
      } else if (e.code === 11000) {
        next(new CONFLICT_ERROR('This email is already exist'));
      } else {
        next(e);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(next);
};
// обновление данных профиля
const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND('User is not found');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BAD_REQUEST('Error validating profile data'));
      } else {
        next(e);
      }
    });
};
// обновление аватара
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND('User is not found');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BAD_REQUEST('Error validating avatar data'));
      } else {
        next(e);
      }
    });
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getUserInfo,
};
