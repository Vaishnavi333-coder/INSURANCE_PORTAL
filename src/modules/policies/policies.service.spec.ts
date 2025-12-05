import { Test, TestingModule } from '@nestjs/testing';
import { PoliciesService } from './policies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Policy } from './entities/policy.entity';
import { Plan } from '../plans/entities/plans.entity';
import { User } from '../users/entities/user.entity';
import { CustomLoggerService } from '../../common/logger';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PoliciesService', () => {
  let service: PoliciesService;
  let policyRepository: Record<string, jest.Mock>;
  let planRepository: Record<string, jest.Mock>;
  let userRepository: Record<string, jest.Mock>;
  let logger: Record<string, jest.Mock>;

  beforeEach(async () => {
    policyRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };

    planRepository = {
      findOne: jest.fn(),
    };

    userRepository = {
      findOne: jest.fn(),
    };

    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoliciesService,
        { provide: getRepositoryToken(Policy), useValue: policyRepository },
        { provide: getRepositoryToken(Plan), useValue: planRepository },
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: CustomLoggerService, useValue: logger },
      ],
    }).compile();

    service = module.get<PoliciesService>(PoliciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new policy', async () => {
      const createPolicyDto = { planId: 1, policyType: 'Health', premiumAmount: 100, startDate: new Date(), endDate: new Date() };
      const userId = 1;
      const user = { userId };
      const plan = { planId: 1 };
      const policy = { policyId: 1, ...createPolicyDto };

      userRepository.findOne.mockResolvedValue(user);
      planRepository.findOne.mockResolvedValue(plan);
      policyRepository.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(policy); // First for check, second for return
      policyRepository.create.mockReturnValue(policy);
      policyRepository.save.mockResolvedValue(policy);

      const result = await service.create(createPolicyDto as any, userId);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { userId } });
      expect(planRepository.findOne).toHaveBeenCalledWith({ where: { planId: createPolicyDto.planId } });
      expect(policyRepository.create).toHaveBeenCalled();
      expect(policyRepository.save).toHaveBeenCalled();
      expect(result).toEqual(policy);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.create({ planId: 1 } as any, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if plan not found', async () => {
      userRepository.findOne.mockResolvedValue({ userId: 1 });
      planRepository.findOne.mockResolvedValue(null);
      await expect(service.create({ planId: 1 } as any, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if already enrolled', async () => {
      userRepository.findOne.mockResolvedValue({ userId: 1 });
      planRepository.findOne.mockResolvedValue({ planId: 1 });
      policyRepository.findOne.mockResolvedValue({ policyId: 1 });
      await expect(service.create({ planId: 1 } as any, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return policies for a user with enriched data', async () => {
      const policies = [{ policyId: 1, plan: { insurer: 'TestInsurer', coverageAmount: 100000, planId: 1 }, createdAt: new Date(), updatedAt: new Date() }];
      policyRepository.find.mockResolvedValue(policies);
      const result = await service.findAll(1);
      expect(result[0].insurer).toBe('TestInsurer');
      expect(result[0].coverage).toBe(100000);
      expect(logger.log).toHaveBeenCalled();
    });

    it('should return empty array if no policies found', async () => {
      policyRepository.find.mockResolvedValue([]);
      const result = await service.findAll(1);
      expect(result).toEqual([]);
    });
  });

  describe('findAllPolicies', () => {
    it('should return all policies for admin with user info', async () => {
      const policies = [{ 
        policyId: 1, 
        plan: { insurer: 'TestInsurer', planId: 1 }, 
        user: { userId: 1, email: 'test@test.com', name: 'Test' },
        createdAt: new Date(),
        updatedAt: new Date()
      }];
      policyRepository.find.mockResolvedValue(policies);
      
      const result = await service.findAllPolicies();
      
      expect(result[0].user).toEqual({ id: 1, email: 'test@test.com', name: 'Test' });
      expect(result[0].insurer).toBe('TestInsurer');
    });
  });

  describe('findOne', () => {
    it('should return a policy', async () => {
      const policy = { policyId: 1 };
      policyRepository.findOne.mockResolvedValue(policy);
      const result = await service.findOne(1);
      expect(result).toEqual(policy);
    });

    it('should throw NotFoundException if policy not found', async () => {
      policyRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a policy', async () => {
      const policy = { policyId: 1 };
      policyRepository.findOne.mockResolvedValue(policy);
      policyRepository.update.mockResolvedValue({ affected: 1 });
      const result = await service.update(1, {} as any);
      expect(result).toEqual(policy);
    });

    it('should throw NotFoundException if policy not found', async () => {
      policyRepository.findOne.mockResolvedValue(null);
      await expect(service.update(1, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a policy', async () => {
      const policy = { policyId: 1, deleted: false };
      policyRepository.findOne.mockResolvedValue(policy);
      policyRepository.update.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(result).toBe('Policy Deleted Successfully');
      expect(policyRepository.update).toHaveBeenCalledWith(1, { deleted: true });
    });

    it('should throw NotFoundException if policy not found', async () => {
      policyRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
