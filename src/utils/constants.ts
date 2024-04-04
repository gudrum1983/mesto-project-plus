import { Response } from 'express';
import { Error } from 'mongoose';
import BadRequestError from '../errors/bad-request-error';

const { constants } = require('http2');

export const isValidError = (err: unknown): BadRequestError | null => {
  if (err instanceof Error && err.name === 'ValidationError') {
    const validateError = new BadRequestError(err.message);
    return validateError;
  }
  return null;
};

export const goodResponse = <T>(res: Response, data: T) => {
  res.status(constants.HTTP_STATUS_OK).send(data);
};

export const createDocumentResponse = <T>(res: Response, data: T) => {
  res.status(constants.HTTP_STATUS_CREATED).send(data);
};
