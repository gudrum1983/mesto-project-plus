import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import {
  checkErrors, createDocument, errorNotFound, errorTypes, goodResponse, unauthorized,
} from '../utils/constants';

const bcrypt = require('bcrypt');

const saltRounds = 10;

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // throw new Error('test');
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
    // отправим токен, браузер сохранит его в куках
    res
      .cookie('jwt', token, {
        // token - наш JWT токен, который мы отправляем
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
    // todo - обработать ответ и ошибку
    return goodResponse(res, user);
  } catch (err) {
    return unauthorized(res);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    // throw new Error('test');
    const users = await User.find({});
    return goodResponse(res, users);
  } catch (err) {
    return checkErrors(err, res);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => errorNotFound());
    return goodResponse(res, user);
  } catch (err) {
    return checkErrors(err, res);
  }
};

export const getUserMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).orFail(() => errorNotFound());
    return goodResponse(res, user);
  } catch (err) {
    return checkErrors(err, res);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = await new User({
      email, name, about, avatar, password: hash,
    }).save();
    return createDocument(res, newUser);
  } catch (err) {
    return checkErrors(err, res);
  }
};
export const updateAvatar = async (req: Request, res: Response) => {
  const idUserProfile = req.user!._id;
  const newAvatar = req.body.avatar;
  try {
    const user = await User.findByIdAndUpdate(
      idUserProfile,
      { avatar: newAvatar },
      { new: true, runValidators: true },
    ).orFail(() => {
      const error = new Error();
      error.name = errorTypes.NOT_FOUND.name;
      return error;
    });
    return goodResponse(res, user);
  } catch (err) {
    return checkErrors(err, res);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const idUserProfile = req.user._id;
  const newName = req.body.name;
  const newAbout = req.body.about;
  try {
    const user = await User.findByIdAndUpdate(
      idUserProfile,
      { name: newName, about: newAbout },
      { new: true, runValidators: true },
    ).orFail(() => {
      const error = new Error();
      error.name = errorTypes.NOT_FOUND.name;
      return error;
    });
    return goodResponse(res, user);
  } catch (err) {
    return checkErrors(err, res);
  }
};
