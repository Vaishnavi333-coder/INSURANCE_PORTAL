import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoliciesService } from './policies.service';
import { PoliciesController } from './policies.controller';
import { Policy } from './entities/policy.entity';
import { Plan } from '../plans/entities/plans.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Policy, Plan, User])],
  controllers: [PoliciesController],
  providers: [PoliciesService],
})
export class PoliciesModule {}
