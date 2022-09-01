const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');
const ERRORS = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(express.json());

app.use(router);

app.use((req, res) => {
  res.status(ERRORS.NOT_FOUND).send({ message: 'Страница по указанному маршруту не найдена' });
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
