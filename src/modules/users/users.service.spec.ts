import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CustomLoggerService } from '../../common/logger';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Record<string, jest.Mock>;
  let logger: Record<string, jest.Mock>;

  beforeEach(async () => {
    userRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: CustomLoggerService, useValue: logger },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = { email: 'test@example.com', password: 'password', name: 'Test User' };
      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue(createUserDto);
      userRepository.save.mockResolvedValue(createUserDto);

      const result = await service.create(createUserDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(userRepository.save).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createUserDto);
    });

    it('should throw ConflictException if user already exists', async () => {
      const createUserDto = { email: 'test@example.com', passwordHash: 'hashedPassword', name: 'Test User' };
      userRepository.findOne.mockResolvedValue(createUserDto);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ userId: 1, email: 'test@example.com' }];
      userRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
    });

    it('should throw NotFoundException if no users found', async () => {
      userRepository.find.mockResolvedValue(null);

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { userId: 1, email: 'test@example.com' };
      userRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = { name: 'Updated Name' };
      const user = { userId: 1, name: 'Old Name' };
      const updatedUser = { userId: 1, name: 'Updated Name' };
      
      userRepository.findOne.mockResolvedValueOnce(user).mockResolvedValueOnce(updatedUser);
      userRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, updateUserDto);

      expect(userRepository.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const user = { userId: 1 };
      userRepository.findOne.mockResolvedValue(user);
      userRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(userRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'User deleted successfully' });
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
