import express from 'express';
import * as mongoose from 'mongoose';
import router from './routes';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';

const PORT = 3000;
const app = express();

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.post('/signin', login);
app.post('/signup', createUser);
// авторизация
app.use(auth);

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
