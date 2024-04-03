import express, { NextFunction, Request, Response } from 'express';
import * as mongoose from 'mongoose';
import * as process from 'process';
import router from './routes';
import { createUser, login } from './controllers/users';
import { requestLogger, errorLogger } from './middlewares/logger';

const { errors } = require('celebrate');

type IError = Error & { statusCode: number };

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1' } = process.env;
const app = express();

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use(requestLogger); // подключаем логер запросов

app.post('/signin', login);
app.post('/signup', createUser);
// авторизация

app.use(errorLogger); // подключаем логер ошибок

/* app.use(errors()); // обработчик ошибок celebrate */

// централизованный обработчик ошибок
app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

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

app.use(router);

connect();
