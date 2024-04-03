const { constants } = require('http2');

export default class InternalServerError extends Error {
  statusCode: number;

  constructor(message = 'Сообщение по умолчанию - Произошла непредвиденная ошибка на сервере') {
    super(message);
    this.statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  }
}
