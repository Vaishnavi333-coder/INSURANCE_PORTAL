import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Policy } from './entities/policy.entity';
import { Repository } from 'typeorm';
import { Plan } from 'src/modules/plans/entities/plans.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { CustomLoggerService } from 'src/common/logger';

@Injectable()
export class PoliciesService {

  constructor(
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private logger: CustomLoggerService,
  ) { }


  async create(createPolicyDto: CreatePolicyDto, userId: number) {

    // 1. validate user
    const user = await this.userRepository.findOne({
      where: { userId }
    });
    if (!user) {
      this.logger.error(`Policy creation failed: User ${userId} not found`);
      throw new NotFoundException('User Not Found');
    }

    // 2. validate plan
    const plan = await this.planRepository.findOne({
      where: { planId: createPolicyDto.planId }
    });
    if (!plan) {
      this.logger.error(`Policy creation failed: Plan ${createPolicyDto.planId} not found`);
      throw new NotFoundException('Plan Not Found');
    }

    // 3. check if user already enrolled in same plan
    const existingPolicy = await this.policyRepository.findOne({
      where: {
        user: { userId },
        plan: { planId: createPolicyDto.planId }
      }
    });

    if (existingPolicy) {
      this.logger.warn(`User ${userId} already enrolled in plan ${createPolicyDto.planId}`);
      throw new BadRequestException('User Already Enrolled in the Same Plan');
    }

    // 4. Create new policy (correct way)
    const policy = this.policyRepository.create({
      ...createPolicyDto,
      user: { userId },   // only reference, not full user
      plan: { planId: createPolicyDto.planId }
    });

    // 5. Save
    await this.policyRepository.save(policy);
    this.logger.log(`Policy ${policy.policyId} created successfully for user ${userId}`);

    // 6. Return clean policy (avoid full user)
    return await this.policyRepository.findOne({
      where: { policyId: policy.policyId },
      relations: { plan: true },
      select: {
        policyId: true,
        plan: { planId: true, name: true },
        policyType: true,
        premiumAmount: true,
        startDate: true,
        endDate: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  //get all policies by user id
  async findAll(userId: number) {
    this.logger.log(`Fetching all policies for userId: ${userId}`);
    const policies = await this.policyRepository.find({
      where: {
        user: { userId: userId },
        deleted : false,
      },
      relations: { plan: true },
    });
    this.logger.log(`Found ${policies.length} policies for userId: ${userId}`);
    // Return empty array instead of throwing error for better UX
    return policies.map(p => ({
      ...p,
      insurer: p.plan?.insurer || '',
      coverage: p.plan?.coverageAmount || 0,
      planId: p.plan?.planId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }

  //get list of all policies of all users, only admins can get all policies
  async findAllPolicies() {
    this.logger.log(`Admin fetching all policies`);
    const policies = await this.policyRepository.find({
      where:{
        deleted:false
      },
      relations: { plan: true, user: true },
    });
    this.logger.log(`Found ${policies.length} total policies`);
    // Return empty array instead of throwing error for admin view
    return policies.map(p => ({
      ...p,
      insurer: p.plan?.insurer || '',
      planId: p.plan?.planId,
      user: p.user ? { id: p.user.userId, email: p.user.email, name: p.user.name } : null,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }
  
  //get a policy by id
  async findOne(id: number) {
    this.logger.log(`Fetching policy with id: ${id}`);
    const policy = await this.policyRepository.findOne({ where: { policyId: id, deleted : false } });
    if (!policy) {
      this.logger.warn(`Policy ${id} not found`);
      throw new NotFoundException('Policy Not Found');
    }
    return policy;
  }

  //update a policy
  async update(id: number, updatePolicyDto: UpdatePolicyDto) {
    const policy = await this.policyRepository.findOne({ where: { policyId: id } });
    if (!policy || policy.deleted) {
      this.logger.error(`Policy update failed: Policy ${id} not found`);
      throw new NotFoundException('Policy Not Found');
    }
    this.logger.log(`Updating policy ${id} with data: ${JSON.stringify(updatePolicyDto)}`);
    await this.policyRepository.update(id, updatePolicyDto);
    return await this.policyRepository.findOne({ where: { policyId: id } });
  }

  //delete a policy, not hard delete but soft delete
  async remove(id: number) {
    this.logger.log(`Deleting policy with id: ${id}`);
    const policy = await this.policyRepository.findOne({ where: { policyId: id } });
    if (!policy) {
      this.logger.error(`Policy deletion failed: Policy ${id} not found`);
      throw new NotFoundException('Policy Not Found');
    }
    if(policy.deleted) {
      this.logger.warn(`Policy ${id} already deleted`);
      return `Policy Does Not Exists`;
    }
    await this.policyRepository.update(id, { deleted: true });
    this.logger.log(`Policy ${id} deleted successfully (soft delete)`);
    return `Policy Deleted Successfully`;
  }
}
