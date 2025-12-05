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
exports.CreateClaimDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateClaimDto {
    policyId;
    claimAmount;
    description;
}
exports.CreateClaimDto = CreateClaimDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy ID of the claim', example: 1 }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Policy ID is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Policy ID must be a number' }),
    __metadata("design:type", Number)
], CreateClaimDto.prototype, "policyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Claim amount of the claim', example: 1000 }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Claim amount is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Claim amount must be a number' }),
    __metadata("design:type", Number)
], CreateClaimDto.prototype, "claimAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description of the claim', example: 'This is a claim for a policy' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Description is required' }),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    (0, class_validator_1.Length)(5, 250, { message: 'Description must be between 5 and 250 characters' }),
    __metadata("design:type", String)
], CreateClaimDto.prototype, "description", void 0);
//# sourceMappingURL=create-claim.dto.js.map