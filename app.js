const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const router = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');

const app = express();
const { PORT = 3000 } = process.env;

app.use(helmet());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
  console.log('Connected to database!');
});

app.use(router);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
