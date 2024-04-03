import { Response } from 'express';
import { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import InternalServerError from '../errors/internal-server-error';
import ConflictCreateError from '../errors/conflict-create-error';
import UnauthorizedError from '../errors/unauthorized-error';

const { constants } = require('http2');

export type TDecoded = string | jwt.JwtPayload | undefined
// const NotFoundError = require('../errors/not-found-error');
// const BadRequestError = require('../errors/bad-request-error');
// const InternalServerError = require('../errors/internal-server-error');
// const ConflictCreateError = require('../errors/conflict-create-error');
// const UnauthorizedError = require('../errors/unauthorized-error');

/* type TError = {
  message: string,
  name: string,
  status: number,
  alt: string,
};

type Name = 'NOT_FOUND' | 'SERVER_ERROR' | 'BAD_REQUEST' | 'CONFLICT_CREATE' | 'UNAUTHORIZED';

export const errorTypes: Record<Name, TError> = {
  NOT_FOUND: {
    message: 'Запрашиваемые данные не найдены',
    name: 'NOT_FOUND',
    status: constants.HTTP_STATUS_BAD_REQUEST,
    alt: '404',
  },
  CONFLICT_CREATE: {
    message: 'Конфликт создания сущности в БД',
    name: 'CONFLICT_CREATE',
    status: constants.HTTP_STATUS_CONFLICT,
    alt: '409',
  },
  SERVER_ERROR: {
    message: 'Произошла непредвиденная ошибка на сервере',
    name: 'SERVER_ERROR',
    status: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
    alt: '500',
  },
  BAD_REQUEST: {
    message: 'Переданы некорректные данные',
    name: 'BAD_REQUEST',
    status: constants.HTTP_STATUS_BAD_REQUEST,
    alt: '400',
  },
  UNAUTHORIZED: {
    message: 'Необходима авторизация',
    name: 'UNAUTHORIZED',
    status: constants.HTTP_STATUS_UNAUTHORIZED,
    alt: '401',
  },
}; */

export const defaultError = (message?: string) => {
  throw new InternalServerError(message);
};

export const unauthorized = (message?: string) => {
  throw new UnauthorizedError(message);
};
export const errorNotFound = (message?: string) => {
  throw new NotFoundError(message);
};

export const conflictCreateError = (res: Response) => {
  throw new ConflictCreateError();
};

export const badRequestError = (res: Response) => {
  throw new BadRequestError();
};

export const JsonWebToken = (err: VerifyErrors | null, decoded: TDecoded) => {
  if (err && err.message === 'JsonWebToken') {
    return unauthorized('Токен протух');
  }
  return decoded;
};

export const goodResponse = <T>(res: Response, data: T) => {
  res.status(constants.HTTP_STATUS_OK).send(data);
};

export const createDocument = <T>(res: Response, data: T) => {
  res.status(constants.HTTP_STATUS_CREATED).send(data);
};

/* export function checkErrors(err: ErrorMongoose | Error | unknown, res: Response) {
  if (err instanceof ErrorMongoose && err.name === 'ValidationError') {
    return badRequestError(res);
  }
  if (err instanceof mongoose.Error.CastError) {
    return notFoundError(res);
  }
  if (err instanceof Error && err.message.startsWith('E11000')) {
    return conflictCreateError(res);
  }
  if (err instanceof Error && err.name === errorTypes.NOT_FOUND.name) {
    return notFoundError(res);
  }
  if (err instanceof Error && err.message === 'NotAuth') {
    return res.status(401).send({ message: 'Неправильный пароль или емайл' });
  }
  if (err instanceof Error && err.name === 'JsonWebToken') {
    return res.status(401).send({ message: 'С токеном что-то не так' });
  }
  /!*  if (err.code === 11000) {
      return res.status(409).send({ message: 'Такой пользователь уже существует' });
    } *!/
  return defaultError(res);
} */
