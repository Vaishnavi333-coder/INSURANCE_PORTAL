import { Test, TestingModule } from '@nestjs/testing';
import { ClaimsService } from './claims.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Claim } from './entities/claim.entity';
import { User } from '../users/entities/user.entity';
import { Policy } from '../policies/entities/policy.entity';
import { CustomLoggerService } from '../../common/logger';
import { NotFoundException } from '@nestjs/common';

describe('ClaimsService', () => {
  let service: ClaimsService;
  let claimRepository: Record<string, jest.Mock>;
  let userRepository: Record<string, jest.Mock>;
  let policyRepository: Record<string, jest.Mock>;
  let logger: Record<string, jest.Mock>;

  beforeEach(async () => {
    claimRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    };

    userRepository = {
      findOne: jest.fn(),
    };

    policyRepository = {
      findOne: jest.fn(),
    };

    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClaimsService,
        { provide: getRepositoryToken(Claim), useValue: claimRepository },
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: getRepositoryToken(Policy), useValue: policyRepository },
        { provide: CustomLoggerService, useValue: logger },
      ],
    }).compile();

    service = module.get<ClaimsService>(ClaimsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new claim', async () => {
      const createClaimDto = { policyId: 1, claimAmount: 100, claimDate: new Date(), reason: 'Test' };
      const userId = 1;
      const user = { userId };
      const policy = { policyId: 1 };
      const claim = { claimId: 1, ...createClaimDto };

      userRepository.findOne.mockResolvedValue(user);
      policyRepository.findOne.mockResolvedValue(policy);
      claimRepository.create.mockReturnValue(claim);
      claimRepository.save.mockResolvedValue(claim);

      const result = await service.create(createClaimDto as any, userId);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { userId } });
      expect(policyRepository.findOne).toHaveBeenCalledWith({ where: { policyId: createClaimDto.policyId } });
      expect(claimRepository.create).toHaveBeenCalled();
      expect(claimRepository.save).toHaveBeenCalled();
      expect(result).toEqual(claim);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.create({ policyId: 1 } as any, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if policy not found', async () => {
      userRepository.findOne.mockResolvedValue({ userId: 1 });
      policyRepository.findOne.mockResolvedValue(null);
      await expect(service.create({ policyId: 1 } as any, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return claims for a user with claimAmt alias', async () => {
      const claims = [{ claimId: 1, claimAmount: 1000 }];
      claimRepository.find.mockResolvedValue(claims);
      const result = await service.findAll(1);
      expect(result).toEqual([{ claimId: 1, claimAmount: 1000, claimAmt: 1000 }]);
      expect(logger.log).toHaveBeenCalled();
    });

    it('should return empty array if no claims found', async () => {
      claimRepository.find.mockResolvedValue([]);
      const result = await service.findAll(1);
      expect(result).toEqual([]);
    });
  });

  describe('findAllClaims', () => {
    it('should return all claims for admin with user info', async () => {
      const claims = [{ claimId: 1, claimAmount: 1000, userId: 1 }];
      const user = { userId: 1, email: 'test@test.com', name: 'Test' };
      claimRepository.find.mockResolvedValue(claims);
      userRepository.findOne.mockResolvedValue(user);
      
      const result = await service.findAllClaims();
      
      expect(result[0].user).toEqual({ id: 1, email: 'test@test.com', name: 'Test' });
      expect(result[0].claimAmt).toBe(1000);
    });
  });

  describe('findAllClaimsPaginated', () => {
    it('should return paginated claims', async () => {
      const claims = [{ claimId: 1, claimAmount: 1000, userId: 1 }];
      const user = { userId: 1, email: 'test@test.com', name: 'Test' };
      claimRepository.count.mockResolvedValue(1);
      claimRepository.find.mockResolvedValue(claims);
      userRepository.findOne.mockResolvedValue(user);
      
      const result = await service.findAllClaimsPaginated(0, 10);
      
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.hasMore).toBe(false);
      expect(result.data.length).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a claim', async () => {
      const claim = { claimId: 1 };
      claimRepository.findOne.mockResolvedValue(claim);
      const result = await service.findOne(1);
      expect(result).toEqual(claim);
    });

    it('should throw NotFoundException if claim not found', async () => {
      claimRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a claim', async () => {
      const claim = { claimId: 1 };
      claimRepository.findOne.mockResolvedValue(claim);
      claimRepository.update.mockResolvedValue({ affected: 1 });
      const result = await service.update(1, {} as any);
      expect(result).toEqual(claim);
    });

    it('should throw NotFoundException if claim not found', async () => {
      claimRepository.findOne.mockResolvedValue(null);
      await expect(service.update(1, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a claim', async () => {
      const claim = { claimId: 1 };
      claimRepository.findOne.mockResolvedValue(claim);
      claimRepository.update.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(result).toEqual({ message: 'Claim Deleted Successfully' });
      expect(claimRepository.update).toHaveBeenCalledWith(1, { deleted: true });
    });

    it('should throw NotFoundException if claim not found', async () => {
      claimRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
