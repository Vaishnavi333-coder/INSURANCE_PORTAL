import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { UserRole } from "../entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MaxLength(50, { message: 'Name must be less than 50 characters' }) 
    name : string;

    @ApiProperty({ description: 'Email of the user', example: 'test@example.com' })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Email must be a valid email' })
    @MaxLength(75, { message: 'Email must be less than 75 characters' })
    email : string;

    @ApiProperty({ description: 'Password of the user', example: 'P@ssw0rd' })
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(100, { message: 'Password must be less than 100 characters' })
    @Matches(/^(?=.{8,100}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character' })
    passwordHash : string;
}
