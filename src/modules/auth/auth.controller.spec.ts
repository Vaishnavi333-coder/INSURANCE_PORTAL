import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CustomLoggerService } from '../../common/logger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Record<string, jest.Mock>;
  let usersService: Record<string, jest.Mock>;
  let logger: Record<string, jest.Mock>;

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
      refreshTokens: jest.fn(),
      logout: jest.fn(),
    };

    usersService = {
      findOne: jest.fn(),
    };

    logger = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: UsersService, useValue: usersService },
        { provide: CustomLoggerService, useValue: logger },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = { email: 'test@example.com', password: 'password', name: 'Test User' };
      const result = { message: 'User registered successfully', userId: 1 };
      authService.register.mockResolvedValue(result);

      expect(await controller.register(registerDto)).toBe(result);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };
      const result = { accessToken: 'token', refreshToken: 'token', userId: 1, message: 'User logged in successfully' };
      authService.login.mockResolvedValue(result);

      expect(await controller.login(loginDto)).toBe(result);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('refresh', () => {
    it('should refresh tokens', async () => {
      const req = { user: { userId: 1 }, body: { refreshToken: 'token' } };
      const result = { accessToken: 'newAccessToken', refreshToken: 'newRefreshToken' };
      authService.refreshTokens.mockResolvedValue(result);

      expect(await controller.refresh(req)).toBe(result);
      expect(authService.refreshTokens).toHaveBeenCalledWith(1, 'token');
    });
  });

  describe('logout', () => {
    it('should logout a user', async () => {
      const req = { user: { userId: 1 } };
      const result = { message: 'User logged out successfully' };
      authService.logout.mockResolvedValue(result);

      expect(await controller.logout(req)).toBe(result);
      expect(authService.logout).toHaveBeenCalledWith(1);
    });
  });
});
