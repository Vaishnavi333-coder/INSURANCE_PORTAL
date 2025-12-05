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
exports.CreatePolicyDto = void 0;
const class_validator_1 = require("class-validator");
const policy_entity_1 = require("../entities/policy.entity");
const swagger_1 = require("@nestjs/swagger");
class CreatePolicyDto {
    policyType;
    planId;
    premiumAmount;
    startDate;
    endDate;
    status;
}
exports.CreatePolicyDto = CreatePolicyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy type of the policy', example: 'TERM' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Policy type is required' }),
    (0, class_validator_1.IsEnum)(policy_entity_1.PolicyType, { message: 'Policy type must be a valid policy type' }),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "policyType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plan ID of the policy', example: 1 }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plan ID is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Plan ID must be a number' }),
    __metadata("design:type", Number)
], CreatePolicyDto.prototype, "planId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Premium amount of the policy', example: 1000 }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Premium amount is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Premium amount must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Premium amount must be greater than 0' }),
    (0, class_validator_1.Max)(1000000, { message: 'Premium amount must be less than 1000000' }),
    __metadata("design:type", Number)
], CreatePolicyDto.prototype, "premiumAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date of the policy', example: '2025-01-01' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Start date is required' }),
    (0, class_validator_1.IsDateString)({}, { message: 'Start date must be a date string' }),
    __metadata("design:type", Date)
], CreatePolicyDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date of the policy', example: '2025-01-01' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'End date is required' }),
    (0, class_validator_1.IsDateString)({}, { message: 'End date must be a date string' }),
    __metadata("design:type", Date)
], CreatePolicyDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Status of the policy', example: 'ACTIVE' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Status is required' }),
    (0, class_validator_1.IsEnum)(policy_entity_1.PolicyStatus, { message: 'Status must be a valid status' }),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "status", void 0);
//# sourceMappingURL=create-policy.dto.js.map