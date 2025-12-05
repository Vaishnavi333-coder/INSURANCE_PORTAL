import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/modules/users/users.module';
import { RefreshTokenStrategy } from './strategy/refresh.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({})], //options when signing
  providers: [AuthService, RefreshTokenStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
