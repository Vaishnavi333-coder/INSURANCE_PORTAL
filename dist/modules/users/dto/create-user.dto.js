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
exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateUserDto {
    name;
    email;
    passwordHash;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the user', example: 'John Doe' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Name is required' }),
    (0, class_validator_1.IsString)({ message: 'Name must be a string' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Name must be less than 50 characters' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email of the user', example: 'test@example.com' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email must be a valid email' }),
    (0, class_validator_1.MaxLength)(75, { message: 'Email must be less than 75 characters' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Password of the user', example: 'P@ssw0rd' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    (0, class_validator_1.IsString)({ message: 'Password must be a string' }),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Password must be less than 100 characters' }),
    (0, class_validator_1.Matches)(/^(?=.{8,100}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "passwordHash", void 0);
//# sourceMappingURL=create-user.dto.js.map