import { constants } from 'http2';

class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message = 'Сообщение по умолчанию - Необходима авторизация') {
    super(message);
    this.statusCode = constants.HTTP_STATUS_UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
