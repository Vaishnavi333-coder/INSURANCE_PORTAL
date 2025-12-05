import { Test, TestingModule } from '@nestjs/testing';
import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';
import { CustomLoggerService } from '../../common/logger';
import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '../users/entities/user.entity';

describe('ClaimsController', () => {
  let controller: ClaimsController;
  let claimsService: Record<string, jest.Mock>;
  let logger: Record<string, jest.Mock>;

  beforeEach(async () => {
    claimsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findAllClaims: jest.fn(),
      findAllClaimsPaginated: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    logger = {
      log: jest.fn(),
      warn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClaimsController],
      providers: [
        { provide: ClaimsService, useValue: claimsService },
        { provide: CustomLoggerService, useValue: logger },
      ],
    }).compile();

    controller = module.get<ClaimsController>(ClaimsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a claim', async () => {
      const dto = { policyId: 1 } as any;
      const req = { user: { userId: 1 } };
      const result = { claimId: 1 };
      claimsService.create.mockResolvedValue(result);

      expect(await controller.create(req, dto)).toBe(result);
      expect(claimsService.create).toHaveBeenCalledWith(dto, 1);
    });
  });

  describe('findAll', () => {
    it('should return claims', async () => {
      const claims = [{ claimId: 1 }];
      const req = { user: { userId: 1 } };
      claimsService.findAll.mockResolvedValue(claims);

      expect(await controller.findAll(req)).toBe(claims);
    });
  });

  describe('findOne', () => {
    it('should return claim if authorized', async () => {
      const claim = { claimId: 1, userId: 1 };
      const req = { user: { userId: 1, role: UserRole.USER } };
      claimsService.findOne.mockResolvedValue(claim);

      expect(await controller.findOne(req, '1')).toBe(claim);
    });

    it('should throw ForbiddenException if unauthorized', async () => {
      const claim = { claimId: 1, userId: 2 };
      const req = { user: { userId: 1, role: UserRole.USER } };
      claimsService.findOne.mockResolvedValue(claim);

      await expect(controller.findOne(req, '1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update claim if authorized', async () => {
      const claim = { claimId: 1, userId: 1 };
      const req = { user: { userId: 1, role: UserRole.USER } };
      claimsService.findOne.mockResolvedValue(claim);
      claimsService.update.mockResolvedValue(claim);

      expect(await controller.update(req, '1', {} as any)).toBe(claim);
    });

    it('should throw ForbiddenException if unauthorized', async () => {
      const claim = { claimId: 1, userId: 2 };
      const req = { user: { userId: 1, role: UserRole.USER } };
      claimsService.findOne.mockResolvedValue(claim);

      await expect(controller.update(req, '1', {} as any)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove claim if authorized', async () => {
      const claim = { claimId: 1, userId: 1 };
      const req = { user: { userId: 1, role: UserRole.USER } };
      claimsService.findOne.mockResolvedValue(claim);
      claimsService.remove.mockResolvedValue('Deleted');

      expect(await controller.remove(req, '1')).toBe('Deleted');
    });

    it('should throw ForbiddenException if unauthorized', async () => {
      const claim = { claimId: 1, userId: 2 };
      const req = { user: { userId: 1, role: UserRole.USER } };
      claimsService.findOne.mockResolvedValue(claim);

      await expect(controller.remove(req, '1')).rejects.toThrow(ForbiddenException);
    });
  });
});
