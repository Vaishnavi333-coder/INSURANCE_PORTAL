import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CustomLoggerService } from '../logger';
export declare class LoggingInterceptor implements NestInterceptor {
    private logger;
    constructor(logger: CustomLoggerService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
