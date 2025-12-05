import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { ConfigService } from '@nestjs/config';
import { UserRole } from 'src/modules/users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CustomLoggerService } from 'src/common/logger';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    private logger;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, logger: CustomLoggerService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        userId: number;
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        accessToken: string;
        refreshToken: string;
        userId: number;
        role: UserRole;
    }>;
    generateTokens(userId: number, email: string, role: UserRole): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    updateRefreshToken(userId: number, refreshToken: string): Promise<{
        message: string;
        userId: number;
    }>;
    refreshTokens(userId: number, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: number): Promise<{
        message: string;
    }>;
}
