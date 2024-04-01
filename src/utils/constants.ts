import { constants } from 'http2';
import { Response } from 'express';
import mongoose, { Error as ErrorMongoose } from 'mongoose';

type TError = {
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
    message: 'Не хватает действительных учётных данных',
    name: 'UNAUTHORIZED',
    status: constants.HTTP_STATUS_UNAUTHORIZED,
    alt: '401',
  },
};

const defaultError = (res: Response) => {
  res.status(errorTypes.SERVER_ERROR.status).send({ message: errorTypes.SERVER_ERROR.message });
};

export const unauthorized = (res: Response) => {
  res.status(errorTypes.UNAUTHORIZED.status).send({ message: errorTypes.UNAUTHORIZED.message });
};
const notFoundError = (res: Response) => {
  res.status(errorTypes.NOT_FOUND.status).send({ message: errorTypes.NOT_FOUND.message });
};

const conflictCreateError = (res: Response) => {
  res
    .status(errorTypes.CONFLICT_CREATE.status)
    .send({ message: errorTypes.CONFLICT_CREATE.message });
};

const badRequestError = (res: Response) => {
  res.status(errorTypes.BAD_REQUEST.status).send({ message: errorTypes.BAD_REQUEST.message });
};

export const goodResponse = <T>(res: Response, data: T) => {
  res.status(constants.HTTP_STATUS_OK).send(data);
};

export const createDocument = <T>(res: Response, data: T) => {
  res.status(constants.HTTP_STATUS_CREATED).send(data);
};

export const errorNotFound = () => {
  const error: Error = new Error();
  error.name = errorTypes.NOT_FOUND.name;
  return error;
};

export function checkErrors(err: ErrorMongoose | Error | unknown, res: Response) {
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
  return defaultError(res);
}
