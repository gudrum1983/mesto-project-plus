import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import Card from '../models/card';
import { checkErrors, errorNotFound, goodResponse } from '../utils/constants';

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']).orFail(() => errorNotFound());
    return goodResponse(res, cards);
  } catch (err) {
    return checkErrors(err, res);
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;
    const ownerId = new ObjectId(req.user._id);
    const newCard = await new Card({ name, link, owner: ownerId }).save();
    return goodResponse(res, await newCard.populate('owner'));
  } catch (err) {
    return checkErrors(err, res);
  }
};

export const remoteCard = async (req: Request, res: Response) => {
  try {
    const cardId = new ObjectId(req.params.cardId);
    const ownerId = new ObjectId(req.user._id);
    const cardToDelete = await Card
      .findOne({ _id: cardId, owner: ownerId })
      .populate(['owner', 'likes'])
      .orFail(() => errorNotFound());
    return goodResponse(res, cardToDelete);
  } catch (err) {
    return checkErrors(err, res);
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {
    const cardId = new ObjectId(req.params.cardId);
    const ownerId = new ObjectId(req.user._id);
    const cardToLike = await Card
      .findByIdAndUpdate(cardId, { $addToSet: { likes: ownerId } }, { new: true })
      .populate(['owner', 'likes'])
      .orFail(() => errorNotFound());
    return goodResponse(res, cardToLike);
  } catch (err) {
    return checkErrors(err, res);
  }
};

export const dislikeCard = async (req: Request, res: Response) => {
  try {
    const cardId = new ObjectId(req.params.cardId);
    const ownerId = req.user._id;
    const cardToDislike = await Card
      .findByIdAndUpdate(cardId, { $pull: { likes: ownerId } }, { new: true })
      .populate(['owner', 'likes'])
      .orFail(() => errorNotFound());
    return goodResponse(res, cardToDislike);
  } catch (err) {
    return checkErrors(err, res);
  }
};
