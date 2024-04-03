import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import { createDocument, errorNotFound, goodResponse } from '../utils/constants';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return goodResponse(res, cards);
  } catch (err) {
    return next(err);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user.id;
    const newCard = await new Card({ name, link, owner: ownerId }).save();
    return createDocument(res, await newCard.populate('owner'));
  } catch (err) {
    return next(err);
  }
};

export const remoteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const ownerId = req.user.id;
    const cardToDelete = await Card
      .findOne({ _id: cardId, owner: ownerId })
      .populate(['owner', 'likes'])
      .orFail(() => errorNotFound());
    return goodResponse(res, cardToDelete);
  } catch (err) {
    return next(err);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const ownerId = req.user.id;
    const cardToLike = await Card
      .findByIdAndUpdate(cardId, { $addToSet: { likes: ownerId } }, { new: true })
      .populate(['owner', 'likes'])
      .orFail(() => errorNotFound());
    return goodResponse(res, cardToLike);
  } catch (err) {
    return next(err);
  }
};

export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const ownerId = req.user.id;
    const cardToDislike = await Card
      .findByIdAndUpdate(cardId, { $pull: { likes: ownerId } }, { new: true })
      .populate(['owner', 'likes'])
      .orFail(() => errorNotFound());
    return goodResponse(res, cardToDislike);
  } catch (err) {
    return next(err);
  }
};
