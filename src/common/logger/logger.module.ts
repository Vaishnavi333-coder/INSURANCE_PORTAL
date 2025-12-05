import { Global, Module } from '@nestjs/common';
import { CustomLoggerService } from './logger.service';

@Global() // Makes this module available everywhere without importing
@Module({
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class LoggerModule {}

