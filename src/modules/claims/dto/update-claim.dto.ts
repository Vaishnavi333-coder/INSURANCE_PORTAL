import { PartialType } from '@nestjs/mapped-types';
import { CreateClaimDto } from './create-claim.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ClaimStatus } from '../entities/claim.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClaimDto extends PartialType(CreateClaimDto) {
  @ApiProperty({ description: 'Status of the claim', example: 'pending', required: false })
  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  @IsEnum(ClaimStatus, { message: 'Status must be a valid claim status' })
  status?: ClaimStatus;
  
  @ApiProperty({ description: 'Rejection reason (required when rejecting)', example: 'Insufficient documentation provided', required: false })
  @IsOptional()
  @IsString({ message: 'Rejection reason must be a string' })
  rejectionReason?: string;
}
