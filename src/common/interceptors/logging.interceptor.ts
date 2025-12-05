import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap, catchError } from 'rxjs';
import { CustomLoggerService } from '../logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: CustomLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, ip } = request;
    const userId = request.user?.userId || 'anonymous';
    const userAgent = request.headers['user-agent'] || 'unknown';
    const now = Date.now();

    // Log incoming request
    this.logger.log(
      `→ ${method} ${url} | User: ${userId} | IP: ${ip}`,
      'HTTP-Request'
    );

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        const statusCode = response.statusCode;
        
        // Log successful response
        this.logger.log(
          `← ${method} ${url} | Status: ${statusCode} | Duration: ${duration}ms | User: ${userId}`,
          'HTTP-Response'
        );
      }),
      catchError((error) => {
        const duration = Date.now() - now;
        
        // Log error response
        this.logger.error(
          `✗ ${method} ${url} | Error: ${error.message} | Duration: ${duration}ms | User: ${userId}`,
          error.stack,
          'HTTP-Error'
        );
        
        throw error; // Re-throw to let NestJS handle it
      }),
    );
  }
}

