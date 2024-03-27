import express, { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import router from './routes';

const PORT = 3000;
const app = express();

// app.get('/', (req: Request, res: Response) => {res.send(req.query);});
// app.listen(PORT, () => {console.log(`App listening on port ${PORT}`);})

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '66028c783de23a3039b1c7df', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

router.use('/', (req: Request, res: Response) => {
  // логика обработки запроса
  console.log(req);
  res.send({ message: 'Hello world121' });
});
app.use(express.json());
app.use(router);

const connect = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect('mongodb://127.0.0.1');
    console.log('Подключились к базе');
    await app.listen(PORT);
    console.log(`App listening on port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
};

connect();
