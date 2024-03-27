import { Request, Response } from 'express';
import { constants } from 'http2';
import { ObjectId } from 'mongodb';
import User from '../models/user';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    console.log('userId', userId);
    const user = await User.find(new ObjectId(userId)).orFail(() => {
      const error = new Error('Пользователя с таким ИД нет');
      error.name = 'Not found';
      return error;
    });

    if (!user) {
      console.log('66028c783de23a3039b1c7df');
      // throw new Error('Пользователь не найден');
      return res.send({ message: 'Пользователь не найден22888' });
    }

    return res.send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'Not found') {
      return res.send(err.message);
    }
    return res.send(err);

    // eslint-disable-next-line max-len
    // return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    console.log(req);
    const newUser = new User(req.body);
    return res.status(constants.HTTP_STATUS_CREATED).send(await newUser.save());
  } catch (err) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};
