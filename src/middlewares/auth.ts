import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { unauthorized } from '../utils/constants';

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return unauthorized(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return unauthorized(res);
  }

  req.user._id = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
