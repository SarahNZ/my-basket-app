import winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logLevel = process.env.LOG_LEVEL || 'info';

export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'api-test-framework' },
  transports: [
    new winston.transports.File({ filename: path.join(logsDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logsDir, 'combined.log') }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export class TestLogger {
  static info(message: string, meta?: any) {
    logger.info(message, meta);
  }

  static error(message: string, error?: any) {
    logger.error(message, { error: error?.message || error, stack: error?.stack });
  }

  static warn(message: string, meta?: any) {
    logger.warn(message, meta);
  }

  static debug(message: string, meta?: any) {
    logger.debug(message, meta);
  }

  static logRequest(method: string, url: string, data?: any) {
    logger.info(`API Request: ${method} ${url}`, { data });
  }

  static logResponse(method: string, url: string, status: number, body?: any) {
    logger.info(`API Response: ${method} ${url} - ${status}`, { body });
  }
}
