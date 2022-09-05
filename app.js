const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/index');
const INTERNAL_SERVER = require('./errors/InternalServerError');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(express.json());

app.use(router);

app.use(errors());
app.use(() => {
  throw new INTERNAL_SERVER('Internal server error');
});

app.listen(PORT);
