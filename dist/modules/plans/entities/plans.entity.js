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
exports.Plan = void 0;
const policy_entity_1 = require("../../policies/entities/policy.entity");
const typeorm_1 = require("typeorm");
let Plan = class Plan {
    planId;
    name;
    description;
    insurer;
    premiumAmount;
    coverageAmount;
    category;
    policies;
};
exports.Plan = Plan;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Plan.prototype, "planId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar2', length: 100 }),
    __metadata("design:type", String)
], Plan.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar2', length: 250 }),
    __metadata("design:type", String)
], Plan.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar2', length: 100 }),
    __metadata("design:type", String)
], Plan.prototype, "insurer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'number', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Plan.prototype, "premiumAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'number', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Plan.prototype, "coverageAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar2', length: 100 }),
    __metadata("design:type", String)
], Plan.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => policy_entity_1.Policy, (policy) => policy.plan),
    __metadata("design:type", Array)
], Plan.prototype, "policies", void 0);
exports.Plan = Plan = __decorate([
    (0, typeorm_1.Entity)()
], Plan);
//# sourceMappingURL=plans.entity.js.map