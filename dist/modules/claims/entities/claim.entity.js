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
exports.Claim = exports.ClaimStatus = void 0;
const policy_entity_1 = require("../../policies/entities/policy.entity");
const typeorm_1 = require("typeorm");
var ClaimStatus;
(function (ClaimStatus) {
    ClaimStatus["PENDING"] = "pending";
    ClaimStatus["APPROVED"] = "approved";
    ClaimStatus["REJECTED"] = "rejected";
    ClaimStatus["IN_REVIEW"] = "in_review";
})(ClaimStatus || (exports.ClaimStatus = ClaimStatus = {}));
let Claim = class Claim {
    claimId;
    userId;
    claimAmount;
    description;
    status;
    rejectionReason;
    submittedAt;
    policy;
    deleted;
};
exports.Claim = Claim;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'number' }),
    __metadata("design:type", Number)
], Claim.prototype, "claimId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'number' }),
    __metadata("design:type", Number)
], Claim.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Claim.prototype, "claimAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Claim.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: ClaimStatus.PENDING }),
    __metadata("design:type", String)
], Claim.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], Claim.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Claim.prototype, "submittedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => policy_entity_1.Policy, (policy) => policy.claims),
    (0, typeorm_1.JoinColumn)({ name: 'policyId' }),
    __metadata("design:type", policy_entity_1.Policy)
], Claim.prototype, "policy", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Claim.prototype, "deleted", void 0);
exports.Claim = Claim = __decorate([
    (0, typeorm_1.Entity)('claims')
], Claim);
//# sourceMappingURL=claim.entity.js.map