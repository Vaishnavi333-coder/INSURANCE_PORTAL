"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const logger_1 = require("./common/logger");
const interceptors_1 = require("./common/interceptors");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = app.get(logger_1.CustomLoggerService);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Capstone Backend')
        .setDescription('Capstone Backend API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    app.setGlobalPrefix('api');
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    app.enableCors();
    app.useGlobalInterceptors(new interceptors_1.LoggingInterceptor(logger));
    app.useGlobalPipes(new common_1.ValidationPipe({
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
//# sourceMappingURL=main.js.map