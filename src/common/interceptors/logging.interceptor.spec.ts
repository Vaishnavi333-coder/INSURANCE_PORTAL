import { Test, TestingModule } from '@nestjs/testing';
import { LoggingInterceptor } from './logging.interceptor';
import { CustomLoggerService } from '../logger';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let logger: Record<string, jest.Mock>;

  beforeEach(async () => {
    logger = {
      log: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggingInterceptor,
        { provide: CustomLoggerService, useValue: logger },
      ],
    }).compile();

    interceptor = module.get<LoggingInterceptor>(LoggingInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should log request and response on success', (done) => {
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          method: 'GET',
          url: '/test',
          ip: '127.0.0.1',
          user: { userId: 1 },
          headers: {},
        }),
        getResponse: jest.fn().mockReturnValue({
          statusCode: 200,
        }),
      }),
    } as unknown as ExecutionContext;

    const next = {
      handle: jest.fn().mockReturnValue(of('response')),
    } as unknown as CallHandler;

    interceptor.intercept(context, next).subscribe({
      next: () => {
        expect(logger.log).toHaveBeenCalledTimes(2); // Request and Response
        expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('→ GET /test'), 'HTTP-Request');
        expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('← GET /test'), 'HTTP-Response');
        done();
      },
    });
  });

  it('should log request and error on failure', (done) => {
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          method: 'GET',
          url: '/test',
          ip: '127.0.0.1',
          user: { userId: 1 },
          headers: {},
        }),
        getResponse: jest.fn().mockReturnValue({
          statusCode: 500,
        }),
      }),
    } as unknown as ExecutionContext;

    const error = new Error('Test Error');
    const next = {
      handle: jest.fn().mockReturnValue(throwError(() => error)),
    } as unknown as CallHandler;

    interceptor.intercept(context, next).subscribe({
      error: (err) => {
        expect(err).toBe(error);
        expect(logger.log).toHaveBeenCalledTimes(1); // Request only
        expect(logger.error).toHaveBeenCalledTimes(1); // Error
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('✗ GET /test'), error.stack, 'HTTP-Error');
        done();
      },
    });
  });
});
