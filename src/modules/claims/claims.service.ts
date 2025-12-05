import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { Claim } from './entities/claim.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Policy } from 'src/modules/policies/entities/policy.entity';
import { CustomLoggerService } from 'src/common/logger';

@Injectable()
export class ClaimsService {

  constructor(
    @InjectRepository(Claim)
    private claimRepository: Repository<Claim>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
    private logger: CustomLoggerService,
  ) {}

  //create a new claim
  async create(createClaimDto: CreateClaimDto, userId: number) {

    // 1. validate user
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      this.logger.error(`Claim creation failed: User ${userId} not found`);
      throw new NotFoundException('User Not Found');
    }

    // 2. validate policy
    const policy = await this.policyRepository.findOne({ where: { policyId: createClaimDto.policyId } });
    if (!policy) {
      this.logger.error(`Claim creation failed: Policy ${createClaimDto.policyId} not found`);
      throw new NotFoundException('Policy Not Found');
    }

    // 3. create claim
    const claim = this.claimRepository.create({
      ...createClaimDto,
      userId: user.userId,
      policy: { policyId: policy.policyId },
    });

    // 4. save and return the claim
    await this.claimRepository.save(claim);
    this.logger.log(`Claim ${claim.claimId} created successfully for user ${userId}`);
    return claim;
  }
 
  //get all claims of a particular user by userId
  async findAll(userId : number) {
    this.logger.log(`Fetching all claims for userId: ${userId}`);
    const claims = await this.claimRepository.find({ 
      where: { userId: userId, deleted: false },
      relations: { policy: true },
    });
    this.logger.log(`Found ${claims.length} claims for userId: ${userId}`);
    // Return with alias fields for frontend compatibility
    return claims.map(c => ({
      ...c,
      claimAmt: c.claimAmount, // alias for frontend
    }));
  }

  //get a claim by id, only authenticated users can get their own claims
  async findOne(id: number) {
    this.logger.log(`Fetching claim with id: ${id}`);
    const claim = await this.claimRepository.findOne({ where: { claimId: id, deleted:false } });
    if (!claim) {
      this.logger.warn(`Claim ${id} not found`);
      throw new NotFoundException('Claim Not Found');
    }
    return claim;
  }

  //get list of all claims, only admins can get all claims
  async findAllClaims() {
    this.logger.log(`Admin fetching all claims`);
    const claims = await this.claimRepository.find({
      where: { deleted: false },
      relations: { policy: true },
    });
    this.logger.log(`Found ${claims.length} total claims`);
    // Fetch users for each claim
    const claimsWithUser = await Promise.all(
      claims.map(async (c) => {
        const user = await this.userRepository.findOne({ where: { userId: c.userId } });
        return {
          ...c,
          claimAmt: c.claimAmount, // alias for frontend
          user: user ? { id: user.userId, email: user.email, name: user.name } : null,
        };
      })
    );
    return claimsWithUser;
  }

  //get list of all claims with pagination, only admins can get all claims
  async findAllClaimsPaginated(offset: number = 0, limit: number = 30) {
    // Get total count first
    const total = await this.claimRepository.count({ where: { deleted: false } });
    
    // Get paginated claims
    const claims = await this.claimRepository.find({
      where: { deleted: false },
      relations: { policy: true },
      order: { submittedAt: 'DESC' },
      skip: offset,
      take: limit,
    });
    
    // Fetch users for each claim
    const claimsWithUser = await Promise.all(
      claims.map(async (c) => {
        const user = await this.userRepository.findOne({ where: { userId: c.userId } });
        return {
          ...c,
          claimAmt: c.claimAmount, // alias for frontend
          user: user ? { id: user.userId, email: user.email, name: user.name } : null,
        };
      })
    );
    
    return {
      data: claimsWithUser,
      pagination: {
        total,
        offset,
        limit,
        hasMore: offset + claims.length < total,
      }
    };
  }

  //update a claim
  async update(id: number, updateClaimDto: UpdateClaimDto) {
    const claim = await this.claimRepository.findOne({ where: { claimId: id, deleted: false } });
    if (!claim) {
      this.logger.error(`Claim update failed: Claim ${id} not found`);
      throw new NotFoundException('Claim Not Found');
    }
    
    const updateData: any = { ...updateClaimDto };

    // Normalize policy update: frontend sends `policyId`, but the entity maps this as a relation `policy`.
    // TypeORM update queries against relation properties can fail for some drivers (Oracle),
    // so we convert `policyId` to the expected relation shape used during create.
    if ('policyId' in updateData && typeof updateData.policyId !== 'undefined' && updateData.policyId !== null) {
      updateData.policy = { policyId: updateData.policyId };
      delete updateData.policyId;
    }

    // If rejectionReason is explicitly passed as undefined or empty, set to null in database
    if ('rejectionReason' in updateData && !updateData.rejectionReason) {
      updateData.rejectionReason = null;
    }

    this.logger.log(`Updating claim ${id}${updateData.status ? ` to status: ${updateData.status}` : ''}${updateData.rejectionReason ? ` with rejection reason` : ''}`);
    await this.claimRepository.update(id, updateData);

    // Return the updated claim including relation data and ensure it's not soft-deleted
    return await this.claimRepository.findOne({ where: { claimId: id, deleted: false }, relations: { policy: true } });
  }

  //delete a claim
  async remove(id: number) {
    this.logger.log(`Deleting claim with id: ${id}`);
    const claim = await this.claimRepository.findOne({ where: { claimId: id, deleted:false } });
    if (!claim) {
      this.logger.error(`Claim deletion failed: Claim ${id} not found`);
      throw new NotFoundException('Claim Not Found');
    }
    await this.claimRepository.update(id, { deleted: true });
    this.logger.log(`Claim ${id} deleted successfully (soft delete)`);

    return { message: 'Claim Deleted Successfully' };
  }
}

