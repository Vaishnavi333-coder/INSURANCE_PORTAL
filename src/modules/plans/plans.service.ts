import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './entities/plans.entity';
import { CustomLoggerService } from 'src/common/logger';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
    private logger: CustomLoggerService,
  ) {}

  // Get all plans
  async findAll() {
    this.logger.log('Fetching all plans');
    const plans = await this.planRepository.find();
    return plans;
  }

  // Get a plan by id
  async findOne(id: number) {
    const plan = await this.planRepository.findOne({ where: { planId: id } });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }
    return plan;
  }

  // Create a new plan (admin only)
  async create(createPlanDto: Partial<Plan>) {
    this.logger.log(`Creating new plan: ${createPlanDto.name}`);
    const plan = this.planRepository.create(createPlanDto);
    await this.planRepository.save(plan);
    return plan;
  }
}

