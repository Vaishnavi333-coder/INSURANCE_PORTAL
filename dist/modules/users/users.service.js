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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const logger_1 = require("../../common/logger");
let UsersService = class UsersService {
    userRepository;
    logger;
    constructor(userRepository, logger) {
        this.userRepository = userRepository;
        this.logger = logger;
    }
    async create(createUserDto) {
        this.logger.log(`Request received for user registration with email : ${createUserDto.email}`);
        const user = await this.userRepository.findOne({ where: { email: createUserDto.email } });
        if (user) {
            this.logger.error(`User already registered with email : ${createUserDto.email}`);
            throw new common_1.ConflictException('User already exists');
        }
        const newUser = this.userRepository.create(createUserDto);
        await this.userRepository.save(newUser);
        return newUser;
    }
    async findAll() {
        this.logger.log(`Fetching all users`);
        const users = await this.userRepository.find();
        if (!users) {
            this.logger.warn(`No users found`);
            throw new common_1.NotFoundException('No users found');
        }
        this.logger.log(`Found ${users.length} users`);
        return users;
    }
    async findOne(id) {
        this.logger.log(`Fetching user with id: ${id}`);
        const user = await this.userRepository.findOne({ where: { userId: id } });
        if (!user) {
            this.logger.warn(`User ${id} not found`);
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async update(id, updateUserDto) {
        this.logger.log(`Updating user with id: ${id}`);
        const user = await this.userRepository.findOne({ where: { userId: id } });
        if (!user) {
            this.logger.error(`User update failed: User ${id} not found`);
            throw new common_1.NotFoundException('User not found');
        }
        await this.userRepository.update(id, updateUserDto);
        this.logger.log(`User ${id} updated successfully`);
        return await this.userRepository.findOne({ where: { userId: id } });
    }
    async remove(id) {
        this.logger.log(`Deleting user with id: ${id}`);
        const user = await this.userRepository.findOne({ where: { userId: id } });
        if (!user) {
            this.logger.error(`User deletion failed: User ${id} not found`);
            throw new common_1.NotFoundException('User not found');
        }
        await this.userRepository.delete(id);
        this.logger.log(`User ${id} deleted successfully`);
        return { message: 'User deleted successfully' };
    }
    async findByEmail(email) {
        return await this.userRepository.findOne({ where: { email } });
    }
    async findByEmailWithPassword(email) {
        return await this.userRepository.findOne({
            where: { email },
            select: ['userId', 'email', 'passwordHash', 'role']
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        logger_1.CustomLoggerService])
], UsersService);
//# sourceMappingURL=users.service.js.map