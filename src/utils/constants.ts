import { constants } from 'http2';
import { Response } from 'express';

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

export const defaultError = (res: Response) => {
  res.status(errorTypes.SERVER_ERROR.status).send({ message: errorTypes.SERVER_ERROR.message });
};

export const notFoundError = (res: Response) => {
  res.status(errorTypes.NOT_FOUND.status).send({ message: errorTypes.NOT_FOUND.message });
};

export const badRequestError = (res: Response) => {
  res.status(errorTypes.BSON_ERROR.status).send({ message: errorTypes.BSON_ERROR.message });
};
