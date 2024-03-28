import { constants } from 'http2';
import { Response } from 'express';
import { Error as ErrorMongoose } from 'mongoose';

type TError = {
  message: string,
  name: string,
  status: number,
  alt: string,
};

type Name = 'NOT_FOUND' | 'SERVER_ERROR' | 'BSON_ERROR';

export const errorTypes: Record<Name, TError> = {
  NOT_FOUND: {
    message: 'Запрашиваемые данные не найдены',
    name: 'NOT_FOUND',
    status: constants.HTTP_STATUS_BAD_REQUEST,
    alt: '404',
  },
  SERVER_ERROR: {
    message: 'Произошла непредвиденная ошибка на сервере',
    name: 'SERVER_ERROR',
    status: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
    alt: '500',
  },
  BSON_ERROR: {
    message: 'Переданы некорректные данные',
    name: 'BSONError',
    status: constants.HTTP_STATUS_BAD_REQUEST,
    alt: '400',
  },
};

const defaultError = (res: Response) => {
  res.status(errorTypes.SERVER_ERROR.status).send({ message: errorTypes.SERVER_ERROR.message });
};

const notFoundError = (res: Response) => {
  res.status(errorTypes.NOT_FOUND.status).send({ message: errorTypes.NOT_FOUND.message });
};

const badRequestError = (res: Response) => {
  res.status(errorTypes.BSON_ERROR.status).send({ message: errorTypes.BSON_ERROR.message });
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
  // BSONError выходит когда например в параметре userId указано некорректное количество символов
  // Скрин ошибки при дебаге в файле  '../src/vendor/image/BSONError.jpg'
  if (err instanceof Error && err.name === errorTypes.BSON_ERROR.name) {
    return badRequestError(res);
  }
  if (err instanceof Error && err.name === errorTypes.NOT_FOUND.name) {
    return notFoundError(res);
  }
  return defaultError(res);
}
