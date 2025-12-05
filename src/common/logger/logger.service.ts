import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    // Create logs directory path
    const logsDir = path.join(process.cwd(), 'logs');

    // Custom format: timestamp | level | context | message
    const customFormat = winston.format.printf(({ level, message, timestamp, context }) => {
      return `${timestamp} | ${level.toUpperCase().padEnd(5)} | [${context || 'Application'}] | ${message}`;
    });

    // Create the Winston logger
    this.logger = winston.createLogger({
      level: 'debug', // Log everything from debug and above
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat,
      ),
      transports: [
        // Console transport (colorized for readability)
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            customFormat,
          ),
        }),

        // Daily rotating file for all logs (info, debug, warn)
        new winston.transports.DailyRotateFile({
          filename: path.join(logsDir, 'app-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          maxSize: '10m',        // Max 10MB per file
          maxFiles: '14d',       // Keep logs for 14 days
          level: 'debug',
        }),

        // Daily rotating file for errors only
        new winston.transports.DailyRotateFile({
          filename: path.join(logsDir, 'error-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          maxSize: '10m',
          maxFiles: '30d',       // Keep error logs for 30 days
          level: 'error',
        }),
      ],
    });
  }

  // Standard log (INFO level)
  log(message: string, context?: string): void {
    this.logger.info(message, { context });
  }

  // Error log
  error(message: string, trace?: string, context?: string): void {
    this.logger.error(`${message}${trace ? ` | Trace: ${trace}` : ''}`, { context });
  }

  // Warning log
  warn(message: string, context?: string): void {
    this.logger.warn(message, { context });
  }

  // Debug log (for development)
  debug(message: string, context?: string): void {
    this.logger.debug(message, { context });
  }

  // Verbose log
  verbose(message: string, context?: string): void {
    this.logger.verbose(message, { context });
  }
}

