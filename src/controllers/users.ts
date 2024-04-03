import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import { createDocument, errorNotFound, goodResponse } from '../utils/constants';
import { generateToken } from '../utils/jwt';

const bcrypt = require('bcrypt');

const saltRounds = 10;
const maxAge = 3600000 * 24 * 7;

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const id = user.id || '';
    const token = generateToken({ id });
    // отправим токен, браузер сохранит его в куках
    res
      .cookie('jwt', token, { maxAge, httpOnly: true });
    // todo - обработать ответ и ошибку
    return goodResponse(res, user);
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
    const user = await User.findById(userId).orFail(() => errorNotFound());
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
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = await new User({ email, name, about, avatar, password: hash }).save();
    return createDocument(res, newUser);
  } catch (err) {
    return next(err);
  }
};
export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  const idUserProfile = req.user!._id;
  const newAvatar = req.body.avatar;
  try {
    const user = await User.findByIdAndUpdate(
      idUserProfile,
      { avatar: newAvatar },
      { new: true, runValidators: true },
    ).orFail(() => errorNotFound());
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
    ).orFail(() => errorNotFound());
    return goodResponse(res, user);
  } catch (err) {
    return next(err);
  }
};
