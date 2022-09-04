const jwt = require('jsonwebtoken');

const SECRET_KEY = 'super-strong-secret';

module.exports = (req, res, next) => {
  // тут будет вся авторизация
  console.log('sasdadasdas', req.headers);
  const { authorization } = req.headers;
  console.log(authorization);
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Need authorization' });
  }
  const token = authorization.replace('Bearer ', '');
  console.log(token);
  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return res.status(401).send({ message: 'Need authorization' });
  }
  req.user = payload;
  console.log('userauth', req.user);
  next();
};
