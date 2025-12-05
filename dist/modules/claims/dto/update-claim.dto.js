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
exports.UpdateClaimDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_claim_dto_1 = require("./create-claim.dto");
const class_validator_1 = require("class-validator");
const claim_entity_1 = require("../entities/claim.entity");
const swagger_1 = require("@nestjs/swagger");
class UpdateClaimDto extends (0, mapped_types_1.PartialType)(create_claim_dto_1.CreateClaimDto) {
    status;
    rejectionReason;
}
exports.UpdateClaimDto = UpdateClaimDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Status of the claim', example: 'pending', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Status must be a string' }),
    (0, class_validator_1.IsEnum)(claim_entity_1.ClaimStatus, { message: 'Status must be a valid claim status' }),
    __metadata("design:type", String)
], UpdateClaimDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rejection reason (required when rejecting)', example: 'Insufficient documentation provided', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Rejection reason must be a string' }),
    __metadata("design:type", String)
], UpdateClaimDto.prototype, "rejectionReason", void 0);
//# sourceMappingURL=update-claim.dto.js.map