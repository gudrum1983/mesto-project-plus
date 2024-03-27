import { Request, Response } from 'express';
import { constants } from 'http2';
import { ObjectId } from 'mongodb';
import User from '../models/user';
import Card from '../models/card';

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await User.find({});
    return res.send(cards);
  } catch (err) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

export const createCard = async (req: Request, res: Response) => {
  console.log(req.user._id); // _id станет доступен
  const { name, link } = req.body;
  const ownerId = req.user._id;
  const newCard = new Card({ name, link, owner: ownerId });
  return res.status(constants.HTTP_STATUS_CREATED).send(await newCard.save());
};

export const remoteCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const card = await User.find(new ObjectId(cardId)).orFail(() => {
      const error = new Error('Пользователя с таким ИД нет');
      error.name = 'Not found';
      return error;
    });
    return res.send(card);
  } catch (err) {
    if (err instanceof Error && err.name === 'Not found') {
      return res.send(err.message);
    }
    return res.send(err);
  }
};
