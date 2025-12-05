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
exports.ClaimsController = void 0;
const common_1 = require("@nestjs/common");
const claims_service_1 = require("./claims.service");
const create_claim_dto_1 = require("./dto/create-claim.dto");
const update_claim_dto_1 = require("./dto/update-claim.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const logger_1 = require("../../common/logger");
let ClaimsController = class ClaimsController {
    claimsService;
    logger;
    constructor(claimsService, logger) {
        this.claimsService = claimsService;
        this.logger = logger;
    }
    async create(req, createClaimDto) {
        const userId = req.user.userId;
        this.logger.log(`User ${userId} creating new claim for policy ${createClaimDto.policyId}`);
        return await this.claimsService.create(createClaimDto, userId);
    }
    async findAll(req) {
        const userId = req.user.userId;
        this.logger.log(`Fetching all claims for userId: ${userId}`);
        return await this.claimsService.findAll(userId);
    }
    async findAllClaimsAdmin(offset, limit) {
        const offsetNum = offset ? parseInt(offset, 10) : 0;
        const limitNum = limit ? parseInt(limit, 10) : 30;
        this.logger.log(`Admin fetching claims: offset=${offsetNum}, limit=${limitNum}`);
        return await this.claimsService.findAllClaimsPaginated(offsetNum, limitNum);
    }
    async findAllClaims() {
        return await this.claimsService.findAllClaims();
    }
    async updateStatus(id, body) {
        this.logger.log(`Admin updating claim ${id} status to ${body.status}${body.rejectionReason ? ' with reason: ' + body.rejectionReason : ''}`);
        return await this.claimsService.update(+id, {
            status: body.status,
            rejectionReason: body.rejectionReason || undefined
        });
    }
    async findOne(req, id) {
        const userId = req.user.userId;
        this.logger.log(`Fetching claim ${id} for userId: ${userId}`);
        const claim = await this.claimsService.findOne(+id);
        if (claim.userId !== userId && req.user.role !== user_entity_1.UserRole.ADMIN) {
            this.logger.warn(`Access denied: User ${userId} attempted to access claim ${id} owned by another user`);
            throw new common_1.ForbiddenException('You cannot access this claim');
        }
        return claim;
    }
    async update(req, id, updateClaimDto) {
        const userId = req.user.userId;
        const claim = await this.claimsService.findOne(+id);
        if (claim.userId !== userId && req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('You cannot update this claim');
        }
        this.logger.log(`User ${userId} updating claim ${id}`);
        return await this.claimsService.update(+id, updateClaimDto);
    }
    async remove(req, id) {
        const userId = req.user.userId;
        this.logger.log(`User ${userId} requesting to delete claim ${id}`);
        const claim = await this.claimsService.findOne(+id);
        if (claim.userId !== userId) {
            this.logger.warn(`Delete denied: User ${userId} attempted to delete claim ${id} owned by another user`);
            throw new common_1.ForbiddenException('You cannot delete this claim');
        }
        return await this.claimsService.remove(+id);
    }
};
exports.ClaimsController = ClaimsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.USER),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Claim created successfully' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_claim_dto_1.CreateClaimDto]),
    __metadata("design:returntype", Promise)
], ClaimsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Claims fetched successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClaimsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('admin'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, type: Number, description: 'Number of records to skip' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Number of records to return (default 30)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All claims fetched successfully (admin)' }),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClaimsController.prototype, "findAllClaimsAdmin", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All claims fetched successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClaimsController.prototype, "findAllClaims", null);
__decorate([
    (0, common_1.Patch)('admin/:id/status'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Claim status updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClaimsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Claim fetched successfully' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ClaimsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Claim updated successfully' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_claim_dto_1.UpdateClaimDto]),
    __metadata("design:returntype", Promise)
], ClaimsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.USER),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Claim deleted successfully' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ClaimsController.prototype, "remove", null);
exports.ClaimsController = ClaimsController = __decorate([
    (0, swagger_1.ApiTags)('Claims'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('claims'),
    __metadata("design:paramtypes", [claims_service_1.ClaimsService,
        logger_1.CustomLoggerService])
], ClaimsController);
//# sourceMappingURL=claims.controller.js.map