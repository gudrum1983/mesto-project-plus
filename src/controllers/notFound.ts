import { Request, Response } from 'express';
import { constants } from 'http2';

// eslint-disable-next-line import/prefer-default-export
export const notFound = (req: Request, res: Response) => {
  res.status(constants.HTTP_STATUS_NOT_FOUND).send('Данной страницы не существует');
};
