import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min } from "class-validator";
import { PolicyStatus, PolicyType } from "../entities/policy.entity";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePolicyDto {
    // @IsNotEmpty({ message: 'User ID is required' })
    // @IsNumber({}, { message: 'User ID must be a number' })
    // userId: number;

    // @IsNotEmpty({ message: 'Insurer is required' })
    // @IsString({ message: 'Insurer must be a string' })
    // @MaxLength(100, { message: 'Insurer must be less than 100 characters' })
    // insurer: string;

    @ApiProperty({ description: 'Policy type of the policy', example: 'TERM' })
    @IsNotEmpty({message : 'Policy type is required' })
    @IsEnum(PolicyType, { message: 'Policy type must be a valid policy type' })
    policyType: PolicyType;

    @ApiProperty({ description: 'Plan ID of the policy', example: 1 })
    @IsNotEmpty({ message: 'Plan ID is required' })
    @IsNumber({}, { message: 'Plan ID must be a number' })
    planId: number;

    @ApiProperty({ description: 'Premium amount of the policy', example: 1000 })
    @IsNotEmpty({ message: 'Premium amount is required' })
    @IsNumber({}, { message: 'Premium amount must be a number' })
    @Min(0, { message: 'Premium amount must be greater than 0' })
    @Max(1000000, { message: 'Premium amount must be less than 1000000' })
    premiumAmount: number;

    @ApiProperty({ description: 'Start date of the policy', example: '2025-01-01' })
    @IsNotEmpty({ message: 'Start date is required' })
    @IsDateString({}, { message: 'Start date must be a date string' })
    //@Transform(({ value }) => new Date(value))
    startDate: Date;

    @ApiProperty({ description: 'End date of the policy', example: '2025-01-01' })
    @IsNotEmpty({ message: 'End date is required' })
    @IsDateString({}, { message: 'End date must be a date string' })
    endDate: Date;

    @ApiProperty({ description: 'Status of the policy', example: 'ACTIVE' })
    @IsNotEmpty({ message: 'Status is required' })
    @IsEnum(PolicyStatus, { message: 'Status must be a valid status' })
    status: PolicyStatus; 
    
}
