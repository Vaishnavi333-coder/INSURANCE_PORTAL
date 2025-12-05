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
exports.PoliciesController = void 0;
const common_1 = require("@nestjs/common");
const policies_service_1 = require("./policies.service");
const create_policy_dto_1 = require("./dto/create-policy.dto");
const update_policy_dto_1 = require("./dto/update-policy.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const roles_guard_1 = require("../auth/guards/roles.guard");
const logger_1 = require("../../common/logger");
let PoliciesController = class PoliciesController {
    policiesService;
    logger;
    constructor(policiesService, logger) {
        this.policiesService = policiesService;
        this.logger = logger;
    }
    async create(req, createPolicyDto) {
        const userId = req.user.userId;
        this.logger.log(`User ${userId} creating new policy for plan ${createPolicyDto.planId}`);
        return await this.policiesService.create(createPolicyDto, userId);
    }
    async findAll(req) {
        const userId = req.user.userId;
        this.logger.log(`Fetching all policies for userId: ${userId}`);
        const policies = await this.policiesService.findAll(userId);
        if (policies.some(policy => policy.userId !== userId) && req.user.role !== user_entity_1.UserRole.ADMIN) {
            this.logger.warn(`Access denied: User ${userId} attempted to access policies owned by another user`);
            throw new common_1.ForbiddenException('You cannot access this policy');
        }
        return policies;
    }
    async findAllPoliciesAdmin() {
        this.logger.log(`Admin fetching all policies`);
        return await this.policiesService.findAllPolicies();
    }
    async findAllPolicies() {
        return await this.policiesService.findAllPolicies();
    }
    async findOne(req, id) {
        const userId = req.user.userId;
        this.logger.log(`Fetching policy ${id} for userId: ${userId}`);
        const policy = await this.policiesService.findOne(+id);
        if (policy.userId !== userId && req.user.role !== user_entity_1.UserRole.ADMIN) {
            this.logger.warn(`Access denied: User ${userId} attempted to access policy ${id} owned by another user`);
            throw new common_1.ForbiddenException('You cannot access this policy');
        }
        return policy;
    }
    async update(req, id, updatePolicyDto) {
        const userId = req.user.userId;
        const policy = await this.policiesService.findOne(+id);
        if (policy.userId !== userId && req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('You cannot update this policy');
        }
        this.logger.log(`User ${userId} updating policy ${id} with status: ${updatePolicyDto.status || 'unchanged'}`);
        return this.policiesService.update(+id, updatePolicyDto);
    }
    async remove(req, id) {
        const userId = req.user.userId;
        this.logger.log(`User ${userId} requesting to delete policy ${id}`);
        const policy = await this.policiesService.findOne(+id);
        if (policy.userId !== userId && req.user.role !== user_entity_1.UserRole.ADMIN) {
            this.logger.warn(`Delete denied: User ${userId} attempted to delete policy ${id} owned by another user`);
            throw new common_1.ForbiddenException('You cannot delete this policy');
        }
        return this.policiesService.remove(+id);
    }
};
exports.PoliciesController = PoliciesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.USER),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Policy created successfully' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_policy_dto_1.CreatePolicyDto]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policies fetched successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('admin'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All policies fetched successfully (admin)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "findAllPoliciesAdmin", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All policies fetched successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "findAllPolicies", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy fetched successfully' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy updated successfully' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_policy_dto_1.UpdatePolicyDto]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy deleted successfully' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "remove", null);
exports.PoliciesController = PoliciesController = __decorate([
    (0, swagger_1.ApiTags)('Policies'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('policies'),
    __metadata("design:paramtypes", [policies_service_1.PoliciesService,
        logger_1.CustomLoggerService])
], PoliciesController);
//# sourceMappingURL=policies.controller.js.map