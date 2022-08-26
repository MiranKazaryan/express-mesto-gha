const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/users");
const cardRouter = require('./routes/cards')

console.log(userRouter)

const {PORT = 3000} = process.env;
const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb");
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6307d5a6f0a859299e74c573' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
})
app.use('/users',userRouter)
app.use('/cards',cardRouter)



app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
