import express, { NextFunction, Request, Response } from 'express';
import * as mongoose from 'mongoose';
import router from './routes';
import { createUser, login } from './controllers/users';

const PORT = 3000;
const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = { _id: '66054790660b8e10ae9420ec' };
  next();
});

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.post('/signin', login);
app.post('/signup', createUser);

const connect = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect('mongodb://127.0.0.1');
    console.log('Подключились к базе');
    await app.listen(PORT);
    console.log(`Сервер запущен па порте: ${PORT}`);
  } catch (err) {
    console.log(err);
  }
};

app.use(router);

connect();
