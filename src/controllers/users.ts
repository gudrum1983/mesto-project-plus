import { NextFunction, Request, Response } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import User, { IUser } from '../models/user';
import { createDocumentResponse, goodResponse, isValidError } from '../utils/constants';
import { generateToken } from '../utils/jwt';
import ConflictCreateError from '../errors/conflict-create-error';
import { ERROR_MESSAGE } from '../utils/textErrorType';
import throwErrorNotFound from '../errors/not-found-error';

const bcrypt = require('bcrypt');

const NAME_DUPLIKATE_KEY_ERROR_INDEX = 'E11000';
const NAME_JWT = 'jwt';
const BCRYPT_SALT = 10;
const SEVEN_DAYS = 3600000 * 24 * 7;

const publicInfoUser = (currentUser: mongoose.Document
  | mongoose.Document & Omit<IUser & { _id: ObjectId; }, never>) => {
  const userObj = currentUser.toObject();
  const { password, _id, ...other } = userObj;
  return other;
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const id = user.id || '';
    const token = generateToken({ id });
    res
      .cookie(NAME_JWT, token, { maxAge: SEVEN_DAYS, httpOnly: true });
    const infoUser = publicInfoUser(user);
    return goodResponse(res, { message: 'Вы успешно вошли в систему', data: infoUser });
  } catch (err) {
    return next(err);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return goodResponse(res, users);
  } catch (err) {
    return next(err);
  }
};

const getUser = async (userId: string, res: Response, next: NextFunction) => {
  try {
    const user = await User
      .findById(userId)
      .orFail(() => throwErrorNotFound(ERROR_MESSAGE.notFoundByIdUser));
    return goodResponse(res, user);
  } catch (err) {
    return next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  return getUser(userId, res, next);
};

export const getUserMe = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.id;
  return getUser(userId, res, next);
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar, email, password } = req.body;
    const salt = bcrypt.genSaltSync(BCRYPT_SALT);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = await new User({ email, name, about, avatar, password: hash });
    await newUser.save();
    const infoUser = publicInfoUser(newUser);
    return createDocumentResponse(res, { message: 'Пользователь успешно создан', data: infoUser });
  } catch (err) {
    // Проверяем, является ли ошибка ошибкой создания сущности
    if (err instanceof Error && err.message.startsWith(NAME_DUPLIKATE_KEY_ERROR_INDEX)) {
      const conflictError = new ConflictCreateError(ERROR_MESSAGE.conflictCreateUser);
      return next(conflictError);
    }
    // Проверяем, является ли ошибка ошибкой валидации Mongoose
    return next(isValidError(err) || err);
  }
};
export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  const idUserProfile = req.user!.id;
  const newAvatar = req.body.avatar;
  try {
    const user = await User.findByIdAndUpdate(
      idUserProfile,
      { avatar: newAvatar },
      { new: true, runValidators: true },
    ).orFail(() => throwErrorNotFound(ERROR_MESSAGE.notFoundByIdUser));
    return goodResponse(res, user);
  } catch (err) {
    return next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  const idUserProfile = req.user.id;
  const newName = req.body.name;
  const newAbout = req.body.about;
  try {
    const user = await User.findByIdAndUpdate(
      idUserProfile,
      { name: newName, about: newAbout },
      { new: true, runValidators: true },
    ).orFail(() => throwErrorNotFound(ERROR_MESSAGE.notFoundByIdUser));
    return goodResponse(res, user);
  } catch (err) {
    return next(err);
  }
};
