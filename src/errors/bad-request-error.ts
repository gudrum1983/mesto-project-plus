import { constants } from 'http2';

class BadRequestError extends Error {
  statusCode: number;

  constructor(message = 'Сообщение по умолчанию - Переданы некорректные данные') {
    super(message);
    this.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
  }
}

module.exports = BadRequestError;
