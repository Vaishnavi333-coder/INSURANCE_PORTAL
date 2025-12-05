import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CustomLoggerService } from '../../common/logger';
import { ForbiddenException } from '@nestjs/common';
import { UserRole } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Record<string, jest.Mock>;
  let logger: Record<string, jest.Mock>;

  beforeEach(async () => {
    usersService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    logger = {
      log: jest.fn(),
      warn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: CustomLoggerService, useValue: logger },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ userId: 1, email: 'test@example.com' }];
      usersService.findAll.mockResolvedValue(users);

      expect(await controller.findAll()).toBe(users);
    });
  });

  describe('findOne', () => {
    it('should return a user if authorized', async () => {
      const user = { userId: 1, email: 'test@example.com' };
      const req = { user: { userId: 1, role: UserRole.USER } };
      usersService.findOne.mockResolvedValue(user);

      expect(await controller.findOne(req, '1')).toBe(user);
    });

    it('should throw ForbiddenException if unauthorized', async () => {
      const user = { userId: 2, email: 'other@example.com' };
      const req = { user: { userId: 1, role: UserRole.USER } };
      usersService.findOne.mockResolvedValue(user);

      await expect(controller.findOne(req, '2')).rejects.toThrow(ForbiddenException);
    });

    it('should allow admin to access any user', async () => {
      const user = { userId: 2, email: 'other@example.com' };
      const req = { user: { userId: 1, role: UserRole.ADMIN } };
      usersService.findOne.mockResolvedValue(user);

      expect(await controller.findOne(req, '2')).toBe(user);
    });
  });

  describe('update', () => {
    it('should update user if authorized', async () => {
      const updateUserDto = { name: 'Updated' };
      const user = { userId: 1 };
      const req = { user: { userId: 1, role: UserRole.USER } };
      usersService.findOne.mockResolvedValue(user);
      usersService.update.mockResolvedValue({ ...user, ...updateUserDto });

      expect(await controller.update(req, '1', updateUserDto)).toEqual({ ...user, ...updateUserDto });
    });

    it('should throw ForbiddenException if unauthorized', async () => {
      const updateUserDto = { name: 'Updated' };
      const user = { userId: 2 };
      const req = { user: { userId: 1, role: UserRole.USER } };
      usersService.findOne.mockResolvedValue(user);

      await expect(controller.update(req, '2', updateUserDto)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove user if authorized', async () => {
      const user = { userId: 1 };
      const req = { user: { userId: 1 } };
      usersService.findOne.mockResolvedValue(user);
      usersService.remove.mockResolvedValue({ message: 'Deleted' });

      expect(await controller.remove(req, '1')).toEqual({ message: 'Deleted' });
    });

    it('should throw ForbiddenException if unauthorized', async () => {
      const user = { userId: 2 };
      const req = { user: { userId: 1 } };
      usersService.findOne.mockResolvedValue(user);

      await expect(controller.remove(req, '2')).rejects.toThrow(ForbiddenException);
    });
  });
});
