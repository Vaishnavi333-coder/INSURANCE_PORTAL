import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { UserRole } from 'src/modules/users/entities/user.entity';
import { CustomLoggerService } from 'src/common/logger';
import { UsersService } from 'src/modules/users/users.service';
export declare class AuthController {
    private authService;
    private usersService;
    private logger;
    constructor(authService: AuthService, usersService: UsersService, logger: CustomLoggerService);
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
    me(req: any): Promise<{
        user: {
            id: number;
            email: string;
            name: string;
            role: UserRole;
        };
    }>;
    refresh(req: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
}
