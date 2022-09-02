const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/index');
const ERRORS = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(express.json());

app.use(router);

app.use((req, res, next) => {
  res.status(ERRORS.NOT_FOUND).send({ message: 'Страница по указанному маршруту не найдена' });
  next();
});
app.use(errors());
app.use((err, req, res, next) => {
  // ...
  console.log('sss');
  res.status(ERRORS.INTERNAL_SERVER).send({ message: 'Internal server error ' });
  next();
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
