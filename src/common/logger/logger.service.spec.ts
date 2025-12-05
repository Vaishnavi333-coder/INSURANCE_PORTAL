import { Test, TestingModule } from '@nestjs/testing';
import { CustomLoggerService } from './logger.service';
import * as winston from 'winston';

// Mock winston
jest.mock('winston', () => {
  const mFormat = {
    combine: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
    colorize: jest.fn(),
  };
  const mTransports = {
    Console: jest.fn(),
    DailyRotateFile: jest.fn(),
  };
  const mLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };
  return {
    format: mFormat,
    transports: mTransports,
    createLogger: jest.fn(() => mLogger),
  };
});

describe('CustomLoggerService', () => {
  let service: CustomLoggerService;
  let winstonLogger: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomLoggerService],
    }).compile();

    service = module.get<CustomLoggerService>(CustomLoggerService);
    winstonLogger = (winston.createLogger as jest.Mock).mock.results[0].value;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log info', () => {
    service.log('test message', 'context');
    expect(winstonLogger.info).toHaveBeenCalledWith('test message', { context: 'context' });
  });

  it('should log error', () => {
    service.error('test error', 'trace', 'context');
    expect(winstonLogger.error).toHaveBeenCalledWith('test error | Trace: trace', { context: 'context' });
  });

  it('should log warn', () => {
    service.warn('test warn', 'context');
    expect(winstonLogger.warn).toHaveBeenCalledWith('test warn', { context: 'context' });
  });

  it('should log debug', () => {
    service.debug('test debug', 'context');
    expect(winstonLogger.debug).toHaveBeenCalledWith('test debug', { context: 'context' });
  });

  it('should log verbose', () => {
    service.verbose('test verbose', 'context');
    expect(winstonLogger.verbose).toHaveBeenCalledWith('test verbose', { context: 'context' });
  });
});
