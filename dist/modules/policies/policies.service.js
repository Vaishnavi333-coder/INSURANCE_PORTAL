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
exports.PoliciesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const policy_entity_1 = require("./entities/policy.entity");
const typeorm_2 = require("typeorm");
const plans_entity_1 = require("../plans/entities/plans.entity");
const user_entity_1 = require("../users/entities/user.entity");
const logger_1 = require("../../common/logger");
let PoliciesService = class PoliciesService {
    policyRepository;
    planRepository;
    userRepository;
    logger;
    constructor(policyRepository, planRepository, userRepository, logger) {
        this.policyRepository = policyRepository;
        this.planRepository = planRepository;
        this.userRepository = userRepository;
        this.logger = logger;
    }
    async create(createPolicyDto, userId) {
        const user = await this.userRepository.findOne({
            where: { userId }
        });
        if (!user) {
            this.logger.error(`Policy creation failed: User ${userId} not found`);
            throw new common_1.NotFoundException('User Not Found');
        }
        const plan = await this.planRepository.findOne({
            where: { planId: createPolicyDto.planId }
        });
        if (!plan) {
            this.logger.error(`Policy creation failed: Plan ${createPolicyDto.planId} not found`);
            throw new common_1.NotFoundException('Plan Not Found');
        }
        const existingPolicy = await this.policyRepository.findOne({
            where: {
                user: { userId },
                plan: { planId: createPolicyDto.planId }
            }
        });
        if (existingPolicy) {
            this.logger.warn(`User ${userId} already enrolled in plan ${createPolicyDto.planId}`);
            throw new common_1.BadRequestException('User Already Enrolled in the Same Plan');
        }
        const policy = this.policyRepository.create({
            ...createPolicyDto,
            user: { userId },
            plan: { planId: createPolicyDto.planId }
        });
        await this.policyRepository.save(policy);
        this.logger.log(`Policy ${policy.policyId} created successfully for user ${userId}`);
        return await this.policyRepository.findOne({
            where: { policyId: policy.policyId },
            relations: { plan: true },
            select: {
                policyId: true,
                plan: { planId: true, name: true },
                policyType: true,
                premiumAmount: true,
                startDate: true,
                endDate: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }
    async findAll(userId) {
        this.logger.log(`Fetching all policies for userId: ${userId}`);
        const policies = await this.policyRepository.find({
            where: {
                user: { userId: userId },
                deleted: false,
            },
            relations: { plan: true },
        });
        this.logger.log(`Found ${policies.length} policies for userId: ${userId}`);
        return policies.map(p => ({
            ...p,
            insurer: p.plan?.insurer || '',
            coverage: p.plan?.coverageAmount || 0,
            planId: p.plan?.planId,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));
    }
    async findAllPolicies() {
        this.logger.log(`Admin fetching all policies`);
        const policies = await this.policyRepository.find({
            where: {
                deleted: false
            },
            relations: { plan: true, user: true },
        });
        this.logger.log(`Found ${policies.length} total policies`);
        return policies.map(p => ({
            ...p,
            insurer: p.plan?.insurer || '',
            planId: p.plan?.planId,
            user: p.user ? { id: p.user.userId, email: p.user.email, name: p.user.name } : null,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));
    }
    async findOne(id) {
        this.logger.log(`Fetching policy with id: ${id}`);
        const policy = await this.policyRepository.findOne({ where: { policyId: id, deleted: false } });
        if (!policy) {
            this.logger.warn(`Policy ${id} not found`);
            throw new common_1.NotFoundException('Policy Not Found');
        }
        return policy;
    }
    async update(id, updatePolicyDto) {
        const policy = await this.policyRepository.findOne({ where: { policyId: id } });
        if (!policy || policy.deleted) {
            this.logger.error(`Policy update failed: Policy ${id} not found`);
            throw new common_1.NotFoundException('Policy Not Found');
        }
        this.logger.log(`Updating policy ${id} with data: ${JSON.stringify(updatePolicyDto)}`);
        await this.policyRepository.update(id, updatePolicyDto);
        return await this.policyRepository.findOne({ where: { policyId: id } });
    }
    async remove(id) {
        this.logger.log(`Deleting policy with id: ${id}`);
        const policy = await this.policyRepository.findOne({ where: { policyId: id } });
        if (!policy) {
            this.logger.error(`Policy deletion failed: Policy ${id} not found`);
            throw new common_1.NotFoundException('Policy Not Found');
        }
        if (policy.deleted) {
            this.logger.warn(`Policy ${id} already deleted`);
            return `Policy Does Not Exists`;
        }
        await this.policyRepository.update(id, { deleted: true });
        this.logger.log(`Policy ${id} deleted successfully (soft delete)`);
        return `Policy Deleted Successfully`;
    }
};
exports.PoliciesService = PoliciesService;
exports.PoliciesService = PoliciesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(policy_entity_1.Policy)),
    __param(1, (0, typeorm_1.InjectRepository)(plans_entity_1.Plan)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        logger_1.CustomLoggerService])
], PoliciesService);
//# sourceMappingURL=policies.service.js.map