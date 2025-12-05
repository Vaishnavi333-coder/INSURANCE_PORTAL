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
exports.Policy = exports.PolicyStatus = exports.PolicyType = void 0;
const claim_entity_1 = require("../../claims/entities/claim.entity");
const plans_entity_1 = require("../../plans/entities/plans.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
var PolicyType;
(function (PolicyType) {
    PolicyType["HOME"] = "home";
    PolicyType["MOTOR"] = "motor";
    PolicyType["TRAVEL"] = "travel";
    PolicyType["HEALTH"] = "health";
    PolicyType["ACCIDENT"] = "accident";
    PolicyType["OTHER"] = "other";
    PolicyType["LIFE"] = "life";
})(PolicyType || (exports.PolicyType = PolicyType = {}));
var PolicyStatus;
(function (PolicyStatus) {
    PolicyStatus["LAPSED"] = "lapsed";
    PolicyStatus["ACTIVE"] = "active";
    PolicyStatus["CANCELLED"] = "cancelled";
    PolicyStatus["EXPIRED"] = "expired";
})(PolicyStatus || (exports.PolicyStatus = PolicyStatus = {}));
let Policy = class Policy {
    policyId;
    userId;
    plan;
    policyType;
    premiumAmount;
    startDate;
    endDate;
    status;
    createdAt;
    updatedAt;
    user;
    claims;
    deleted;
};
exports.Policy = Policy;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'number' }),
    __metadata("design:type", Number)
], Policy.prototype, "policyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'number' }),
    __metadata("design:type", Number)
], Policy.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => plans_entity_1.Plan, (plan) => plan.policies),
    (0, typeorm_1.JoinColumn)({ name: 'planId' }),
    __metadata("design:type", plans_entity_1.Plan)
], Policy.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar2',
        length: 50,
        enum: PolicyType,
    }),
    __metadata("design:type", String)
], Policy.prototype, "policyType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'number', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Policy.prototype, "premiumAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => "CURRENT_TIMESTAMP"
    }),
    __metadata("design:type", Date)
], Policy.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Policy.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar2', length: 20, enum: PolicyStatus, default: PolicyStatus.LAPSED }),
    __metadata("design:type", String)
], Policy.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Policy.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Policy.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.policies),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Policy.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => claim_entity_1.Claim, (claim) => claim.policy),
    __metadata("design:type", Array)
], Policy.prototype, "claims", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Policy.prototype, "deleted", void 0);
exports.Policy = Policy = __decorate([
    (0, typeorm_1.Entity)()
], Policy);
//# sourceMappingURL=policy.entity.js.map