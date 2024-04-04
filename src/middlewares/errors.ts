import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';

type CustomError = Error & { statusCode: number };

export default (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  return res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
};
