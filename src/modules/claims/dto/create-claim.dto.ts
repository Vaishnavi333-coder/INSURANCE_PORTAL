import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

import { ClaimStatus } from '../entities/claim.entity';
import { ApiProperty } from '@nestjs/swagger';



export class CreateClaimDto {

    @ApiProperty({ description: 'Policy ID of the claim', example: 1 })
    @IsNotEmpty({ message: 'Policy ID is required' })
    @IsNumber({}, {message: 'Policy ID must be a number'})
    policyId: number;

    //does IsNumber checks for NaN and Infinity, we will have to find and modify the code to handle this

    // @IsNotEmpty({ message: 'User ID is required' })
    // @IsNumber({}, { message: 'User ID must be a number'})
    // userId: number;
    //we will extract userId from the token in the controller

    @ApiProperty({ description: 'Claim amount of the claim', example: 1000 })
    @IsNotEmpty({ message: 'Claim amount is required' })
    @IsNumber({}, { message: 'Claim amount must be a number'})
    claimAmount: number;
    
    @ApiProperty({ description: 'Description of the claim', example: 'This is a claim for a policy' })
    @IsNotEmpty({ message: 'Description is required' } )
    @IsString( { message: 'Description must be a string' })
    @Length(5,250, { message: 'Description must be between 5 and 250 characters' })
    description: string;

    // @IsNotEmpty({ message: 'Status is required' })
    // @IsString({ message: 'Status must be a string' })
    // @IsEnum(ClaimStatus, { message: 'Status must be a valid status' })
    // status: ClaimStatus;
    //users should not provide status while filing claim, 
    // it will be set to default value in the entity 

    //@IsNotEmpty({ message: 'Submitted at is required' })
    // @IsDateString({}, { message: 'Submitted at must be a date string' })
    // @Transform(({ value }) => new Date(value))
    // submittedAt?: Date;
    //will get from database default value

    //we are not sending submittedAt in the request body, so we are not validating it
    //submittedAt is set to default value in the entity
}
