import { NextFunction, Request, Response } from 'express';
import throwErrorNotFound from '../errors/not-found-error';
import Card from '../models/card';
import { goodResponse, isValidError, createDocumentResponse } from '../utils/constants';
import ForbiddenError from '../errors/forbidden-error';
import { ERROR_MESSAGE, TextCustom } from '../utils/textErrorType';

const OWNER = 'owner';
const LIKES = 'likes';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({}).populate([OWNER, LIKES]);
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
    return createDocumentResponse(res, await newCard.populate(OWNER));
  } catch (err) {
    // Проверяем, является ли ошибка ошибкой валидации Mongoose
    return next(isValidError(err) || err);
  }
};

export const remoteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const ownerId = req.user.id;
    const cardToDelete = await Card
      .findById(cardId)
      .orFail(() => throwErrorNotFound(ERROR_MESSAGE.notFoundByIdCard));
    if (cardToDelete.owner.toString() !== ownerId) {
      const forbiddenError = new ForbiddenError(ERROR_MESSAGE.forbiddenDeleteCard);
      return next(forbiddenError);
    }
    return goodResponse(res, { message: TextCustom.successDelete });
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
      .populate([OWNER, LIKES])
      .orFail(() => throwErrorNotFound(ERROR_MESSAGE.notFoundByIdCard));
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
      .populate([OWNER, LIKES])
      .orFail(() => throwErrorNotFound(ERROR_MESSAGE.notFoundByIdCard));
    return goodResponse(res, cardToDislike);
  } catch (err) {
    return next(err);
  }
};
