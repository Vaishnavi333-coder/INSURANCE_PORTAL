import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomLoggerService } from './common/logger';
import { LoggingInterceptor } from './common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get logger from DI container
  const logger = app.get(CustomLoggerService);

  const config = new DocumentBuilder()
    .setTitle('Capstone Backend')
    .setDescription('Capstone Backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.setGlobalPrefix('api');
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();

  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(logger),    // Log all API requests
  );

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  logger.log(`Application running on http://localhost:${port}`, 'Bootstrap');
  logger.log(`Swagger docs at http://localhost:${port}/docs`, 'Bootstrap');
}
bootstrap();
