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
exports.User = exports.UserRole = void 0;
const policy_entity_1 = require("../../policies/entities/policy.entity");
const typeorm_1 = require("typeorm");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = class User {
    userId;
    name;
    email;
    passwordHash;
    role;
    createdAt;
    refreshToken;
    lastActivity;
    policies;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'number' }),
    __metadata("design:type", Number)
], User.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar2', length: 50 }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar2', length: 75, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar2', length: 250, select: false }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar2', length: 10, default: UserRole.USER }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar2', length: 250, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "refreshToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Object)
], User.prototype, "lastActivity", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => policy_entity_1.Policy, (policy) => policy.user),
    __metadata("design:type", Array)
], User.prototype, "policies", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=user.entity.js.map