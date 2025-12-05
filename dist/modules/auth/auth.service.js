"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const config_1 = require("@nestjs/config");
const logger_1 = require("../../common/logger");
let AuthService = class AuthService {
    usersService;
    jwtService;
    configService;
    logger;
    constructor(usersService, jwtService, configService, logger) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = logger;
    }
    async register(registerDto) {
        const { email, password, name } = registerDto;
        const user = await this.usersService.findByEmail(email);
        if (user) {
            this.logger.error(`user already exists with email : ${email}`);
            throw new common_1.ConflictException('Email already in use');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await this.usersService.create({
            email,
            passwordHash,
            name,
        });
        this.logger.log(`User registered successfully`);
        return {
            message: 'User registered successfully',
            userId: newUser.userId,
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        this.logger.log(`Processing login request for email: ${email}`);
        const user = await this.usersService.findByEmailWithPassword(email);
        if (!user) {
            this.logger.warn(`Login failed: User not found for email: ${email}`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordCorrect) {
            this.logger.warn(`Login failed: Invalid password for email: ${email}`);
            throw new common_1.UnauthorizedException('Invalid Password');
        }
        const tokens = await this.generateTokens(user.userId, user.email, user.role);
        await this.updateRefreshToken(user.userId, tokens.refreshToken);
        this.logger.log(`Login successful for userId: ${user.userId}, role: ${user.role}`);
        return {
            message: 'User logged in successfully',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            userId: user.userId,
            role: user.role
        };
    }
    async generateTokens(userId, email, role) {
        const payload = { userId: userId, email: email, role: role };
        const accessToken = await this.jwtService.signAsync(payload, { secret: this.configService.get('JWT_ACCESS_SECRET') || "Anupam-Kumar", expiresIn: '15m' });
        const refreshToken = await this.jwtService.signAsync(payload, { secret: this.configService.get('JWT_REFRESH_SECRET') || "Anupam-Kumar", expiresIn: '7d' });
        return { accessToken, refreshToken };
    }
    async updateRefreshToken(userId, refreshToken) {
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        user.refreshToken = hashedRefreshToken;
        user.lastActivity = new Date();
        await this.usersService.update(userId, user);
        return {
            message: 'Refresh token stored successfully',
            userId: user.userId,
        };
    }
    async refreshTokens(userId, refreshToken) {
        this.logger.log(`Processing token refresh for userId: ${userId}`);
        const user = await this.usersService.findOne(userId);
        if (!user || !user.refreshToken) {
            this.logger.warn(`Token refresh failed: User ${userId} not found or refresh token missing`);
            throw new common_1.UnauthorizedException('User not found or refresh token missing');
        }
        const lastActive = user.lastActivity || new Date(0);
        const isInactive = Date.now() - lastActive.getTime() > 7 * 24 * 60 * 60 * 1000;
        if (isInactive) {
            this.logger.warn(`Token refresh failed: User ${userId} inactive for more than 7 days`);
            throw new common_1.UnauthorizedException('User is inactive for more than 7 days');
        }
        const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isRefreshTokenValid) {
            this.logger.warn(`Token refresh failed: Invalid refresh token for userId: ${userId}`);
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const tokens = await this.generateTokens(userId, user.email, user.role);
        await this.updateRefreshToken(userId, tokens.refreshToken);
        this.logger.log(`Token refresh successful for userId: ${userId}`);
        return tokens;
    }
    async logout(userId) {
        this.logger.log(`Processing logout for userId: ${userId}`);
        const user = await this.usersService.findOne(userId);
        if (!user) {
            this.logger.error(`Logout failed: User ${userId} not found`);
            throw new common_1.UnauthorizedException('User not found');
        }
        user.refreshToken = null;
        await this.usersService.update(userId, user);
        this.logger.log(`Logout successful for userId: ${userId}`);
        return { message: 'User logged out successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        logger_1.CustomLoggerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map