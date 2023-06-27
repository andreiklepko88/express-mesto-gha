const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { NOT_FOUND_CODE } = require('./utils/constants');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
  console.log('Connected to database!');
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '649609ae2079a309ba49619a',
  };

  next();
});

app.use(userRoutes);
app.use(cardRoutes);
app.use('*', (req, res) => {
  res.status(NOT_FOUND_CODE).send({
    message: 'Incorrect address',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
