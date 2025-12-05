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
exports.ClaimsService = void 0;
const common_1 = require("@nestjs/common");
const claim_entity_1 = require("./entities/claim.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const policy_entity_1 = require("../policies/entities/policy.entity");
const logger_1 = require("../../common/logger");
let ClaimsService = class ClaimsService {
    claimRepository;
    userRepository;
    policyRepository;
    logger;
    constructor(claimRepository, userRepository, policyRepository, logger) {
        this.claimRepository = claimRepository;
        this.userRepository = userRepository;
        this.policyRepository = policyRepository;
        this.logger = logger;
    }
    async create(createClaimDto, userId) {
        const user = await this.userRepository.findOne({ where: { userId } });
        if (!user) {
            this.logger.error(`Claim creation failed: User ${userId} not found`);
            throw new common_1.NotFoundException('User Not Found');
        }
        const policy = await this.policyRepository.findOne({ where: { policyId: createClaimDto.policyId } });
        if (!policy) {
            this.logger.error(`Claim creation failed: Policy ${createClaimDto.policyId} not found`);
            throw new common_1.NotFoundException('Policy Not Found');
        }
        const claim = this.claimRepository.create({
            ...createClaimDto,
            userId: user.userId,
            policy: { policyId: policy.policyId },
        });
        await this.claimRepository.save(claim);
        this.logger.log(`Claim ${claim.claimId} created successfully for user ${userId}`);
        return claim;
    }
    async findAll(userId) {
        this.logger.log(`Fetching all claims for userId: ${userId}`);
        const claims = await this.claimRepository.find({
            where: { userId: userId, deleted: false },
            relations: { policy: true },
        });
        this.logger.log(`Found ${claims.length} claims for userId: ${userId}`);
        return claims.map(c => ({
            ...c,
            claimAmt: c.claimAmount,
        }));
    }
    async findOne(id) {
        this.logger.log(`Fetching claim with id: ${id}`);
        const claim = await this.claimRepository.findOne({ where: { claimId: id, deleted: false } });
        if (!claim) {
            this.logger.warn(`Claim ${id} not found`);
            throw new common_1.NotFoundException('Claim Not Found');
        }
        return claim;
    }
    async findAllClaims() {
        this.logger.log(`Admin fetching all claims`);
        const claims = await this.claimRepository.find({
            where: { deleted: false },
            relations: { policy: true },
        });
        this.logger.log(`Found ${claims.length} total claims`);
        const claimsWithUser = await Promise.all(claims.map(async (c) => {
            const user = await this.userRepository.findOne({ where: { userId: c.userId } });
            return {
                ...c,
                claimAmt: c.claimAmount,
                user: user ? { id: user.userId, email: user.email, name: user.name } : null,
            };
        }));
        return claimsWithUser;
    }
    async findAllClaimsPaginated(offset = 0, limit = 30) {
        const total = await this.claimRepository.count({ where: { deleted: false } });
        const claims = await this.claimRepository.find({
            where: { deleted: false },
            relations: { policy: true },
            order: { submittedAt: 'DESC' },
            skip: offset,
            take: limit,
        });
        const claimsWithUser = await Promise.all(claims.map(async (c) => {
            const user = await this.userRepository.findOne({ where: { userId: c.userId } });
            return {
                ...c,
                claimAmt: c.claimAmount,
                user: user ? { id: user.userId, email: user.email, name: user.name } : null,
            };
        }));
        return {
            data: claimsWithUser,
            pagination: {
                total,
                offset,
                limit,
                hasMore: offset + claims.length < total,
            }
        };
    }
    async update(id, updateClaimDto) {
        const claim = await this.claimRepository.findOne({ where: { claimId: id, deleted: false } });
        if (!claim) {
            this.logger.error(`Claim update failed: Claim ${id} not found`);
            throw new common_1.NotFoundException('Claim Not Found');
        }
        const updateData = { ...updateClaimDto };
        if ('policyId' in updateData && typeof updateData.policyId !== 'undefined' && updateData.policyId !== null) {
            updateData.policy = { policyId: updateData.policyId };
            delete updateData.policyId;
        }
        if ('rejectionReason' in updateData && !updateData.rejectionReason) {
            updateData.rejectionReason = null;
        }
        this.logger.log(`Updating claim ${id}${updateData.status ? ` to status: ${updateData.status}` : ''}${updateData.rejectionReason ? ` with rejection reason` : ''}`);
        await this.claimRepository.update(id, updateData);
        return await this.claimRepository.findOne({ where: { claimId: id, deleted: false }, relations: { policy: true } });
    }
    async remove(id) {
        this.logger.log(`Deleting claim with id: ${id}`);
        const claim = await this.claimRepository.findOne({ where: { claimId: id, deleted: false } });
        if (!claim) {
            this.logger.error(`Claim deletion failed: Claim ${id} not found`);
            throw new common_1.NotFoundException('Claim Not Found');
        }
        await this.claimRepository.update(id, { deleted: true });
        this.logger.log(`Claim ${id} deleted successfully (soft delete)`);
        return { message: 'Claim Deleted Successfully' };
    }
};
exports.ClaimsService = ClaimsService;
exports.ClaimsService = ClaimsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(claim_entity_1.Claim)),
    __param(1, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_2.InjectRepository)(policy_entity_1.Policy)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        logger_1.CustomLoggerService])
], ClaimsService);
//# sourceMappingURL=claims.service.js.map