import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { ConfigService } from '@nestjs/config';
import { UserRole } from 'src/modules/users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CustomLoggerService } from 'src/common/logger';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private logger : CustomLoggerService
    ) { }

    //register a new user
    async register(registerDto: RegisterDto) {
        const { email, password, name } = registerDto;

        //check if user already exists
        const user = await this.usersService.findByEmail(email);
        if (user) {
            this.logger.error(`user already exists with email : ${email}`)
            throw new ConflictException('Email already in use');
        }

        //hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        //create a new user (role defaults to USER in the database)
        const newUser = await this.usersService.create({
            email,
            passwordHash,
            name,
        });
        this.logger.log(`User registered successfully`);

        return {
            message: 'User registered successfully',
            userId: newUser.userId,
        };
    }

    //login a user
    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        this.logger.log(`Processing login request for email: ${email}`);

        const user = await this.usersService.findByEmailWithPassword(email);
        if (!user) {
            this.logger.warn(`Login failed: User not found for email: ${email}`);
            throw new UnauthorizedException('Invalid credentials'); // Don't reveal if email exists
        }

        //check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordCorrect) {
            this.logger.warn(`Login failed: Invalid password for email: ${email}`);
            throw new UnauthorizedException('Invalid Password');
        }

        //one more method we will find out later which one is better
        const tokens = await this.generateTokens(user.userId, user.email, user.role);
        await this.updateRefreshToken(user.userId, tokens.refreshToken);
        this.logger.log(`Login successful for userId: ${user.userId}, role: ${user.role}`);

        return {
            message: 'User logged in successfully',
            accessToken: tokens.accessToken, //valid only for 15 min
            refreshToken: tokens.refreshToken,  //7 days
            userId: user.userId,
            role:user.role
        };

        //generate access token
        //const accessToken = await this.jwtService.signAsync({ userId: user.userId }, { secret: this.configService.get('JWT_ACCESS_SECRET') });

        //generate refresh token
        //const refreshToken = await this.jwtService.signAsync({ userId: user.userId }, { secret: this.configService.get('JWT_REFRESH_SECRET') });

        // return {
        //     message: 'User logged in successfully',
        //     accessToken: accessToken,
        //     refreshToken: refreshToken,
        //     userId: user.userId,
        // };
    }

    //methods to generate tokens
    async generateTokens(userId: number, email: string, role: UserRole) {

        const payload = { userId: userId, email: email, role: role };

        const accessToken = await this.jwtService.signAsync(payload, { secret: this.configService.get('JWT_ACCESS_SECRET') || "Anupam-Kumar", expiresIn: '15m' });

        const refreshToken = await this.jwtService.signAsync(payload, { secret: this.configService.get('JWT_REFRESH_SECRET') || "Anupam-Kumar", expiresIn: '7d' });

        return { accessToken, refreshToken };
    }

    //Store hashing refresh token in the database + update lastActivity of the user
    async updateRefreshToken(userId: number, refreshToken: string) {
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        user.refreshToken = hashedRefreshToken;
        user.lastActivity = new Date();

        await this.usersService.update(userId, user);

        return {
            message: 'Refresh token stored successfully',
            userId: user.userId,
        };
    }

    //refresh tokens (sliding expiration of 7 days)
    async refreshTokens(userId: number, refreshToken: string) {
        this.logger.log(`Processing token refresh for userId: ${userId}`);
        const user = await this.usersService.findOne(userId);
        if (!user || !user.refreshToken) {
            this.logger.warn(`Token refresh failed: User ${userId} not found or refresh token missing`);
            throw new UnauthorizedException('User not found or refresh token missing');
        }
        //check if inactive for more than 7 days
        const lastActive = user.lastActivity || new Date(0);

        const isInactive = Date.now() - lastActive.getTime() > 7 * 24 * 60 * 60 * 1000;
        if (isInactive) {
            this.logger.warn(`Token refresh failed: User ${userId} inactive for more than 7 days`);
            throw new UnauthorizedException('User is inactive for more than 7 days');
        }

        // validate refresh token against stored hashed refresh token
        const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isRefreshTokenValid) {
            this.logger.warn(`Token refresh failed: Invalid refresh token for userId: ${userId}`);
            throw new UnauthorizedException('Invalid refresh token');
        }

        //now we will generate new access and refresh tokens
        const tokens = await this.generateTokens(userId, user.email, user.role);
        await this.updateRefreshToken(userId, tokens.refreshToken);
        this.logger.log(`Token refresh successful for userId: ${userId}`);
        return tokens;
    }

    //logout a user
    async logout(userId: number) {
        this.logger.log(`Processing logout for userId: ${userId}`);
        const user = await this.usersService.findOne(userId);
        if (!user) {
            this.logger.error(`Logout failed: User ${userId} not found`);
            throw new UnauthorizedException('User not found');
        }
        user.refreshToken = null;
        await this.usersService.update(userId, user);
        this.logger.log(`Logout successful for userId: ${userId}`);
        return { message: 'User logged out successfully' };
    }
}
