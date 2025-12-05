"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const logger_1 = require("../logger");
let LoggingInterceptor = class LoggingInterceptor {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const { method, url, ip } = request;
        const userId = request.user?.userId || 'anonymous';
        const userAgent = request.headers['user-agent'] || 'unknown';
        const now = Date.now();
        this.logger.log(`→ ${method} ${url} | User: ${userId} | IP: ${ip}`, 'HTTP-Request');
        return next.handle().pipe((0, rxjs_1.tap)(() => {
            const duration = Date.now() - now;
            const statusCode = response.statusCode;
            this.logger.log(`← ${method} ${url} | Status: ${statusCode} | Duration: ${duration}ms | User: ${userId}`, 'HTTP-Response');
        }), (0, rxjs_1.catchError)((error) => {
            const duration = Date.now() - now;
            this.logger.error(`✗ ${method} ${url} | Error: ${error.message} | Duration: ${duration}ms | User: ${userId}`, error.stack, 'HTTP-Error');
            throw error;
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_1.CustomLoggerService])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map