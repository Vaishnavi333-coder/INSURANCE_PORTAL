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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const auth_service_1 = require("./auth.service");
const refresh_auth_guard_1 = require("./guards/refresh-auth.guard");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const logger_1 = require("../../common/logger");
const users_service_1 = require("../users/users.service");
let AuthController = class AuthController {
    authService;
    usersService;
    logger;
    constructor(authService, usersService, logger) {
        this.authService = authService;
        this.usersService = usersService;
        this.logger = logger;
    }
    register(registerDto) {
        this.logger.log(`Received Request for New User Registration`);
        return this.authService.register(registerDto);
    }
    login(loginDto) {
        this.logger.log(`Login attempt for email: ${loginDto.email}`);
        return this.authService.login(loginDto);
    }
    async me(req) {
        this.logger.log(`Fetching current user profile for userId: ${req.user.userId}`);
        const user = await this.usersService.findOne(req.user.userId);
        return { user: { id: user.userId, email: user.email, name: user.name, role: user.role } };
    }
    refresh(req) {
        this.logger.log(`Token refresh requested for userId: ${req.user.userId}`);
        return this.authService.refreshTokens(req.user.userId, req.body.refreshToken);
    }
    logout(req) {
        this.logger.log(`Logout requested for userId: ${req.user.userId}`);
        return this.authService.logout(req.user.userId);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User registered successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User logged in successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current user fetched successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.UseGuards)(refresh_auth_guard_1.RefreshAuthGuard),
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tokens refreshed successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User logged out successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService,
        logger_1.CustomLoggerService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map