const jwt = require('jsonwebtoken');

const SECRET_KEY = 'super-strong-secret';

module.exports = (req, res, next) => {
  // тут будет вся авторизация
 // console.log(req.headers);
  const { authorization } = req.headers;
  console.log(authorization);
  if (!authorization) {
    return res.status(401).send({ message: 'Need authorization' });
  }
  const token = authorization.replace('Bearer', '');
  console.log('da', token);
  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return res.status(401).send({ message: 'Need authorization' });
  }
  req.user = payload;
  console.log('user', req.user);
  next();
};
