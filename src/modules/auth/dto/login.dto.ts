import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength, MaxLength, IsEmail, IsString, Matches } from "class-validator";

export class LoginDto {

    @ApiProperty({ description: 'Email of the user', example: 'test@example.com' })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Email must be a valid email' })
    @MaxLength(75, { message: 'Email must be less than 75 characters' })
    email: string;

    @ApiProperty({ description: 'Password of the user', example: 'password' })
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(50, { message: 'Password must be less than 50 characters' })
    @Matches(/^(?=.{8,100}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character' })
    password: string;
}