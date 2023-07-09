const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const errorHandler = require('./middlewares/error-handler');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');

const app = express();
const { PORT = 3000 } = process.env;

app.use(helmet());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
  console.log('Connected to database!');
});

app.post('/signin', login);
app.post('/signup', createUser);
app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardRoutes);
app.use('*', (req, res, next) => {
  next(new NotFoundError(`Resource is not found by the address ${req.path}.`));
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
