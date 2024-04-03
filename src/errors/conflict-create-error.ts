import { constants } from 'http2';

class ConflictCreateError extends Error {
  statusCode: number;

  constructor(message = 'Сообщение по умолчанию - Конфликт создания сущности в БД') {
    super(message);
    this.statusCode = constants.HTTP_STATUS_CONFLICT;
  }
}

module.exports = ConflictCreateError;
