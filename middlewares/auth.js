const jwt = require('jsonwebtoken');

const SECRET_KEY = 'super-strong-secret';
// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  // тут будет вся авторизация
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Need authorization' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return res.status(401).send({ message: 'Need authorization' });
  }
  req.user = payload;
  next();
};
