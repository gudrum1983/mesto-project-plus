// импортируем нужные модули
import winston from 'winston';
import expressWinston from 'express-winston';
import 'winston-daily-rotate-file';

const transportError = new winston.transports.DailyRotateFile({
  // указываем формат имени файла
  filename: 'logs/error-%DATE%.log',
  // указываем шаблон для даты
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  zippedArchive: true,
  maxFiles: 14,
});

const transportRequest = new winston.transports.DailyRotateFile({
  // указываем формат имени файла
  filename: 'logs/request-%DATE%.log',
  // указываем шаблон для даты
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  zippedArchive: true,
  maxFiles: 14,
});

// создадим логер запросов
export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    transportRequest,
  ],
  format: winston.format.json(),
});

// логер ошибок
export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    transportError,
  ],
  format: winston.format.json(),
});
