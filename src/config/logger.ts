import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { env } from './env';

const logDir = path.join(process.cwd(), 'logs');

// ── Log Formats ──────────────────────────────────────────────

const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  }),
);

const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// ── Transports ───────────────────────────────────────────────

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: env.NODE_ENV === 'development' ? devFormat : prodFormat,
  }),
];

if (env.NODE_ENV === 'production') {
  // Rotate error logs daily
  transports.push(
    new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '30d',
      maxSize: '20m',
      format: prodFormat,
    }),
  );

  // Rotate combined logs daily
  transports.push(
    new DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      maxSize: '20m',
      format: prodFormat,
    }),
  );
}

// ── Logger ───────────────────────────────────────────────────

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  defaultMeta: { service: 'indotimesmedia' },
  transports,
  exitOnError: false,
});

// ── HTTP Request Logger Stream ───────────────────────────────

export const httpLogStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};
