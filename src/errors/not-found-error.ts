const { constants } = require('http2');

class NotFoundError extends Error {
  statusCode: number;

  constructor(message = 'Сообщение по умолчанию - Запрашиваемые вами данные не найдены') {
    super(message);
    this.statusCode = constants.HTTP_STATUS_NOT_FOUND;
  }
}

export default (message?: string) => {
  throw new NotFoundError(message);
};
