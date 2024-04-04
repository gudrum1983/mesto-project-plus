import * as jwt from 'jsonwebtoken';
import { UserIDJwtPayload, VerifyErrors } from 'jsonwebtoken';
import process from 'process';
import { ERROR_MESSAGE } from './textErrorType';
import UnauthorizedError from '../errors/unauthorized-error';

const DEFAULT_DEV_SECRET_KEY = 'dev_secret_key';
const { NODE_ENV = 'dev_test', JWT_SECRET = DEFAULT_DEV_SECRET_KEY } = process.env;
const JWT_SEVEN_DAYS = '7d';

type TDecoded = string | jwt.JwtPayload | undefined

export const JsonWebToken = (err: VerifyErrors | null, decoded: TDecoded) => {
  if (err && err.message === 'JsonWebToken') {
    throw new UnauthorizedError(ERROR_MESSAGE.incorrectToken);
  }
  return decoded;
};
export const generateToken = (payload: { id: string }) => jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : DEFAULT_DEV_SECRET_KEY, { expiresIn: JWT_SEVEN_DAYS });

export const verifyToken = (token: string) => <UserIDJwtPayload><unknown>jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : DEFAULT_DEV_SECRET_KEY, (err, decoded) => JsonWebToken(err, decoded));
