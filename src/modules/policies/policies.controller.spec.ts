import { Test, TestingModule } from '@nestjs/testing';
import { PoliciesController } from './policies.controller';
import { PoliciesService } from './policies.service';
import { CustomLoggerService } from '../../common/logger';
import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '../users/entities/user.entity';

describe('PoliciesController', () => {
  let controller: PoliciesController;
  let policiesService: Record<string, jest.Mock>;
  let logger: Record<string, jest.Mock>;

  beforeEach(async () => {
    policiesService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findAllPolicies: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    logger = {
      log: jest.fn(),
      warn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoliciesController],
      providers: [
        { provide: PoliciesService, useValue: policiesService },
        { provide: CustomLoggerService, useValue: logger },
      ],
    }).compile();

    controller = module.get<PoliciesController>(PoliciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a policy', async () => {
      const dto = { planId: 1 } as any;
      const req = { user: { userId: 1 } };
      const result = { policyId: 1 };
      policiesService.create.mockResolvedValue(result);

      expect(await controller.create(req, dto)).toBe(result);
      expect(policiesService.create).toHaveBeenCalledWith(dto, 1);
    });
  });

  describe('findAll', () => {
    it('should return policies if authorized', async () => {
      const policies = [{ policyId: 1, userId: 1 }];
      const req = { user: { userId: 1, role: UserRole.USER } };
      policiesService.findAll.mockResolvedValue(policies);

      expect(await controller.findAll(req)).toBe(policies);
    });

    it('should throw ForbiddenException if unauthorized', async () => {
      const policies = [{ policyId: 1, userId: 2 }];
      const req = { user: { userId: 1, role: UserRole.USER } };
      policiesService.findAll.mockResolvedValue(policies);

      await expect(controller.findAll(req)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findOne', () => {
    it('should return policy if authorized', async () => {
      const policy = { policyId: 1, userId: 1 };
      const req = { user: { userId: 1, role: UserRole.USER } };
      policiesService.findOne.mockResolvedValue(policy);

      expect(await controller.findOne(req, '1')).toBe(policy);
    });

    it('should throw ForbiddenException if unauthorized', async () => {
      const policy = { policyId: 1, userId: 2 };
      const req = { user: { userId: 1, role: UserRole.USER } };
      policiesService.findOne.mockResolvedValue(policy);

      await expect(controller.findOne(req, '1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update policy if authorized', async () => {
      const policy = { policyId: 1, userId: 1 };
      const req = { user: { userId: 1, role: UserRole.USER } };
      policiesService.findOne.mockResolvedValue(policy);
      policiesService.update.mockResolvedValue(policy);

      expect(await controller.update(req, '1', {} as any)).toBe(policy);
    });

    it('should throw ForbiddenException if unauthorized', async () => {
      const policy = { policyId: 1, userId: 2 };
      const req = { user: { userId: 1, role: UserRole.USER } };
      policiesService.findOne.mockResolvedValue(policy);

      await expect(controller.update(req, '1', {} as any)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove policy if authorized', async () => {
      const policy = { policyId: 1, userId: 1 };
      const req = { user: { userId: 1, role: UserRole.USER } };
      policiesService.findOne.mockResolvedValue(policy);
      policiesService.remove.mockResolvedValue('Deleted');

      expect(await controller.remove(req, '1')).toBe('Deleted');
    });

    it('should throw ForbiddenException if unauthorized', async () => {
      const policy = { policyId: 1, userId: 2 };
      const req = { user: { userId: 1, role: UserRole.USER } };
      policiesService.findOne.mockResolvedValue(policy);

      await expect(controller.remove(req, '1')).rejects.toThrow(ForbiddenException);
    });
  });
});
