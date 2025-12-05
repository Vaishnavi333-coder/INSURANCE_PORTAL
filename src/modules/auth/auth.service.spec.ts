import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from '../../common/logger';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/entities/user.entity';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Record<string, jest.Mock>;
  let jwtService: Record<string, jest.Mock>;
  let configService: Record<string, jest.Mock>;
  let logger: Record<string, jest.Mock>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findByEmailWithPassword: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    configService = {
      get: jest.fn(),
    };

    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        { provide: CustomLoggerService, useValue: logger },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = { email: 'test@example.com', password: 'password', name: 'Test User' };
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue({ userId: 1, ...registerDto });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const result = await service.register(registerDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(usersService.create).toHaveBeenCalled();
      expect(result).toEqual({ message: 'User registered successfully', userId: 1 });
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerDto = { email: 'test@example.com', password: 'password', name: 'Test User' };
      usersService.findByEmail.mockResolvedValue({ userId: 1, ...registerDto });

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const user = { userId: 1, email: 'test@example.com', passwordHash: 'hashedPassword', role: UserRole.USER };
      
      usersService.findByEmailWithPassword.mockResolvedValue(user);
      usersService.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('token');
      usersService.update.mockResolvedValue(user);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.userId).toBe(1);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      usersService.findByEmailWithPassword.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const user = { userId: 1, email: 'test@example.com', passwordHash: 'hashedPassword', role: UserRole.USER };
      
      usersService.findByEmailWithPassword.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const userId = 1;
      const user = { userId, refreshToken: 'token' };
      usersService.findOne.mockResolvedValue(user);
      usersService.update.mockResolvedValue(user);

      const result = await service.logout(userId);

      expect(usersService.findOne).toHaveBeenCalledWith(userId);
      expect(usersService.update).toHaveBeenCalled();
      expect(result).toEqual({ message: 'User logged out successfully' });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      usersService.findOne.mockResolvedValue(null);

      await expect(service.logout(1)).rejects.toThrow(UnauthorizedException);
    });
  });
});
