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
exports.PlansService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const plans_entity_1 = require("./entities/plans.entity");
const logger_1 = require("../../common/logger");
let PlansService = class PlansService {
    planRepository;
    logger;
    constructor(planRepository, logger) {
        this.planRepository = planRepository;
        this.logger = logger;
    }
    async findAll() {
        this.logger.log('Fetching all plans');
        const plans = await this.planRepository.find();
        return plans;
    }
    async findOne(id) {
        const plan = await this.planRepository.findOne({ where: { planId: id } });
        if (!plan) {
            throw new common_1.NotFoundException('Plan not found');
        }
        return plan;
    }
    async create(createPlanDto) {
        this.logger.log(`Creating new plan: ${createPlanDto.name}`);
        const plan = this.planRepository.create(createPlanDto);
        await this.planRepository.save(plan);
        return plan;
    }
};
exports.PlansService = PlansService;
exports.PlansService = PlansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(plans_entity_1.Plan)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        logger_1.CustomLoggerService])
], PlansService);
//# sourceMappingURL=plans.service.js.map