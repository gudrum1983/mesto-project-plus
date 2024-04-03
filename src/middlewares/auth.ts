import { NextFunction, Request, Response } from 'express';
import { UserIDJwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt';
import { unauthorized } from '../utils/constants';

export default (req: Request, res: Response, next: NextFunction) => {
  let payload: UserIDJwtPayload;
  try {
    const token = req.headers.authorization;
    if (!token) {
      return unauthorized();
    }
    const validToken = token.replace('Bearer ', '');
    payload = verifyToken(validToken);
  } catch (err) {
    return next(err);
  }
  req.user = payload; // записываем payload в объект запроса
  return next(); // пропускаем запрос дальше
};
