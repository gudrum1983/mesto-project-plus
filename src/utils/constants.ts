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
