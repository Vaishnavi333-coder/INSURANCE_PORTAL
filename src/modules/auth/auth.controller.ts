import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { UserRole } from 'src/modules/users/entities/user.entity';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomLoggerService } from 'src/common/logger';
import { UsersService } from 'src/modules/users/users.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private usersService: UsersService,
        private logger: CustomLoggerService
    ) {}

    //register a new user
    @Post('register')
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    register(@Body() registerDto: RegisterDto) {
        this.logger.log(`Received Request for New User Registration`)
        return this.authService.register(registerDto);
    }

    //login a user
    @Post('login')
    @ApiResponse({ status: 200, description: 'User logged in successfully' })
    login(@Body() loginDto: LoginDto) {
        this.logger.log(`Login attempt for email: ${loginDto.email}`);
        return this.authService.login(loginDto);
    }

    //get current user profile
    @UseGuards(JwtAuthGuard)
    @Get('me')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Current user fetched successfully' })
    async me(@Req() req: any) {
        this.logger.log(`Fetching current user profile for userId: ${req.user.userId}`);
        const user = await this.usersService.findOne(req.user.userId);
        return { user: { id: user.userId, email: user.email, name: user.name, role: user.role } };
    }

    //refresh tokens
    //to refresh token, the user must also send their refresh token
    @UseGuards(RefreshAuthGuard)
    @Post('refresh')
    @ApiResponse({ status: 200, description: 'Tokens refreshed successfully' })
    refresh(@Req() req: any) {
        this.logger.log(`Token refresh requested for userId: ${req.user.userId}`);
        return this.authService.refreshTokens(req.user.userId, req.body.refreshToken);
    }

    //logout a user
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @ApiResponse({ status: 200, description: 'User logged out successfully' })
    logout(@Req() req: any) {
        this.logger.log(`Logout requested for userId: ${req.user.userId}`);
        return this.authService.logout(req.user.userId);
    }
}
