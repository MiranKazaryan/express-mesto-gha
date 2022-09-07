const jwt = require('jsonwebtoken');
const AUTHORIZATION_ERROR = require('../errors/AuthorizationError');

const SECRET_KEY = 'super-strong-secret';
// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  // тут будет вся авторизация
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AUTHORIZATION_ERROR('Need authorization'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    throw new AUTHORIZATION_ERROR('Need authorization');
  }
  req.user = payload;
  next();
};
