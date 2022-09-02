const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ERRORS = require('../utils/constants');

const SECRET_KEY = 'super-strong-secret';

// получение данных о пользователях
const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch((e) => next(e));
};
// получение данных о пользователе
const getUser = (req, res, next) => {
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
        next(e);
      }
    });
};
const getUserInfo = (req, res) =>{
  User.findById(req.user._id)
    .orFail(() => {
      const error = new Error('User is not found');
      error.statusCode = ERRORS.NOT_FOUND;
      throw error;
    })
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      }
    })
    .catch((e) => {
    /*  if (e.name === "CastError") {
        res.status(ERRORS.BAD_REQUEST).send({ message: "Uncorrect data " });
      } else if (e.statusCode === ERRORS.NOT_FOUND) {
        res.status(ERRORS.NOT_FOUND).send({ message: e.message });
      } else {
        res.status(ERRORS.INTERNAL_SERVER).send({ message: "Server error " });
      }*/
      next(e);
    });
};
// создание пользователя
/*const createUser = (req, res) => {
  console.log("createerr");
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    return res
      .status(ERRORS.BAD_REQUEST)
      .send({ message: 'Email or password can not be empty' });
  }
  User.findOne({ email }).then((user) => {
    if (user) {
      return res
        .status(ERRORS.CONFLICT_ERROR)
        .send({ message: "User already exist" });
    }
    //bcrypt
      //.hash(password, 10)
      //.then((hash) => {
        console.log(password);
        User.create({
          name,
          about,
          avatar,
          email,
          password,//: hash,
        });
      })
      .then((u) => res.status(201).send(u))
      .catch((e) => {
        console.log('error', e.name);
        if (e.name === "ValidationError") {
          res
            .status(ERRORS.BAD_REQUEST)
            .send({ message: "Error validating user " });
        } else {
          res
            .status(ERRORS.INTERNAL_SERVER)
            .send({ message: "Server error" });
        }
      });
  //});
};*/
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => User.create({
    name, about, avatar, email, password: hash,
  }))
    .then((user) => { res.status(201).send(user); })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(ERRORS.BAD_REQUEST).send({ message: 'Error validating user ' });
      } else if (e.code === 11000) {
        res.status(ERRORS.CONFLICT_ERROR).send({message: 'This email is already exist' });
      } else {
        next(e);
      }
    });
};
const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({ token: jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' }) });
    })
    .catch((err) => {
      res
        .status(ERRORS.UNAUTHORIZED)
        .send({ message: err.message });
    });
};
// обновление данных профиля
const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        res.status(ERRORS.NOT_FOUND).send({ message: 'User is not found ' });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res
          .status(ERRORS.BAD_REQUEST)
          .send({ message: 'Error validating profile data ' });
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
        res.status(ERRORS.NOT_FOUND).send({ message: 'User is not found' });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res
          .status(ERRORS.BAD_REQUEST)
          .send({ message: 'Error validating avatar data ' });
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
