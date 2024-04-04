const { constants } = require('http2');

export default class ForbiddenError extends Error {
  statusCode: number;

  constructor(message = 'Сообщение по умолчанию -  Нет доступа ') {
    super(message);
    this.statusCode = constants.HTTP_STATUS_FORBIDDEN;
  }
}
