import { Request, Response } from 'express';
import { constants } from 'http2';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import User from '../models/user';
import {
  errorTypes, badRequestError, defaultError, notFoundError,
} from '../utils/constants';

export const getUsers = async (req: Request, res: Response) => {
  try {
    // throw new Error('test');
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return defaultError(res);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(new ObjectId(userId)).orFail(() => {
      const error = new Error();
      error.name = errorTypes.NOT_FOUND.name;
      return error;
    });
    return res.send(user);
  } catch (err) {
    if (err instanceof Error && err.name === errorTypes.BSON_ERROR.name) {
      return badRequestError(res);
    }
    if (err instanceof Error && err.name === errorTypes.NOT_FOUND.name) {
      return notFoundError(res);
    }
    return res.send(err);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = new User(req.body);
    return res.status(constants.HTTP_STATUS_CREATED).send(await newUser.save());
  } catch (err) {
    if (err instanceof mongoose.Error && err.name === 'ValidationError') {
      return badRequestError(res);
    }
    return defaultError(res);
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  const idUserProfile = req.user._id;
  const newAvatar = req.body.avatar;
  try {
    const user = await User.findByIdAndUpdate(
      new ObjectId(idUserProfile),
      { avatar: newAvatar },
      { new: true, runValidators: true },
    ).orFail(() => {
      const error = new Error();
      error.name = errorTypes.NOT_FOUND.name;
      return error;
    });
    return res.status(constants.HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err instanceof Error && err.name === errorTypes.NOT_FOUND.name) {
      return notFoundError(res);
    }
    if (err instanceof mongoose.Error && err.name === 'ValidationError') {
      return badRequestError(res);
    }
    return defaultError(res);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const idUserProfile = req.user._id;
  const newName = req.body.name;
  const newAbout = req.body.about;
  try {
    const user = await User.findByIdAndUpdate(
      new ObjectId(idUserProfile),
      { name: newName, about: newAbout },
      { new: true, runValidators: true },
    ).orFail(() => {
      const error = new Error();
      error.name = errorTypes.NOT_FOUND.name;
      return error;
    });
    return res.status(constants.HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err instanceof Error && err.name === errorTypes.NOT_FOUND.name) {
      return notFoundError(res);
    }
    if (err instanceof mongoose.Error && err.name === 'ValidationError') {
      return badRequestError(res);
    }
    return defaultError(res);
  }
};
