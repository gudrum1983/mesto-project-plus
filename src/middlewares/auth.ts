import { NextFunction, Request, Response } from 'express';
import { UserIDJwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt';
import UnauthorizedError from '../errors/unauthorized-error';
import { ERROR_MESSAGE } from '../utils/textErrorType';

export default (req: Request, res: Response, next: NextFunction) => {
  let payload: UserIDJwtPayload;
  try {
    const token = req.headers.authorization;
    if (!token) {
      const notAuthorizedError = new UnauthorizedError(ERROR_MESSAGE.notAuth);
      return next(notAuthorizedError);
    }
    const validToken = token.replace('Bearer ', '');
    payload = verifyToken(validToken);
  } catch (err) {
    return next(err);
  }
  req.user = payload; // записываем payload в объект запроса
  return next(); // пропускаем запрос дальше
};
