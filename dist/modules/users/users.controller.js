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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const update_user_dto_1 = require("./dto/update-user.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("./entities/user.entity");
const logger_1 = require("../../common/logger");
let UsersController = class UsersController {
    usersService;
    logger;
    constructor(usersService, logger) {
        this.usersService = usersService;
        this.logger = logger;
    }
    findAllAdmin() {
        this.logger.log(`Admin fetching all users`);
        return this.usersService.findAll();
    }
    findAll() {
        this.logger.log(`Fetching all users`);
        return this.usersService.findAll();
    }
    async findOne(req, id) {
        const userId = req.user.userId;
        this.logger.log(`Fetching user ${id} for userId: ${userId}`);
        const user = await this.usersService.findOne(+id);
        if (user.userId !== userId && req.user.role !== user_entity_1.UserRole.ADMIN) {
            this.logger.warn(`Access denied: User ${userId} attempted to access user ${id}`);
            throw new common_1.ForbiddenException('You cannot access this user');
        }
        return user;
    }
    async update(req, id, updateUserDto) {
        const userId = req.user.userId;
        this.logger.log(`User ${userId} updating user ${id}`);
        const user = await this.usersService.findOne(+id);
        if (user.userId !== userId && req.user.role !== user_entity_1.UserRole.ADMIN) {
            this.logger.warn(`Update denied: User ${userId} attempted to update user ${id}`);
            throw new common_1.ForbiddenException('You cannot update this user');
        }
        return this.usersService.update(+id, updateUserDto);
    }
    async remove(req, id) {
        const userId = req.user.userId;
        this.logger.log(`User ${userId} requesting to delete user ${id}`);
        const user = await this.usersService.findOne(+id);
        if (user.userId !== userId) {
            this.logger.warn(`Delete denied: User ${userId} attempted to delete user ${id}`);
            throw new common_1.ForbiddenException('You cannot delete this user');
        }
        return this.usersService.remove(+id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Get)('admin'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All users fetched successfully (admin)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAllAdmin", null);
__decorate([
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Users fetched successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User fetched successfully' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User updated successfully' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User deleted successfully' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        logger_1.CustomLoggerService])
], UsersController);
//# sourceMappingURL=users.controller.js.map