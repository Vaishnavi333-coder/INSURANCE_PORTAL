import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaimsService } from './claims.service';
import { ClaimsController } from './claims.controller';
import { Claim } from './entities/claim.entity';
import { User } from '../users/entities/user.entity';
import { Policy } from '../policies/entities/policy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Claim, User, Policy])],
  controllers: [ClaimsController],
  providers: [ClaimsService],
})
export class ClaimsModule {}
