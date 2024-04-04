import express from 'express';
import * as mongoose from 'mongoose';
import * as process from 'process';
import router from './routes';
import { createUser, login } from './controllers/users';
import { requestLogger, errorLogger } from './middlewares/logger';
import { validateCreateUser, validateLogin } from './middlewares/validate';
import handlerErrors from './middlewares/errors';

const { errors } = require('celebrate');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1' } = process.env;
const app = express();

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use(requestLogger); // логер запросов

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(router);

app.use(errorLogger); // логер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(handlerErrors); // централизованный обработчик ошибок

async function connect() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGO_URL, {});
    console.log(`Подключились к базе ${PORT}`);
    await app.listen(PORT);
    console.log(`Сервер запущен па порте: ${PORT}`);
  } catch (err) {
    console.log(err);
  }
}

connect();
