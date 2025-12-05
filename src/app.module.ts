import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClaimsModule } from './modules/claims/claims.module';
import { PoliciesModule } from './modules/policies/policies.module';
import { UsersModule } from './modules/users/users.module';
import { PlansModule } from './modules/plans/plans.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig, { DatabaseConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Claim } from './modules/claims/entities/claim.entity';
import { Policy } from './modules/policies/entities/policy.entity';
import { User } from './modules/users/entities/user.entity';
import { Plan } from './modules/plans/entities/plans.entity';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerModule } from './common/logger';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [LoggerModule, ClaimsModule, PoliciesModule, UsersModule, PlansModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const db = config.get<DatabaseConfig>('database');
        if (!db) {
          throw new Error('Database configuration not found');
        }
        return {
          type: db.type as any,
        host: db.host,
        port: db.port,
        username: db.username,
        password: db.password,
        serviceName: db.serviceName,
        entities: [Policy, Claim, User, Plan],
        synchronize: db.synchronize,
        //autoLoadEntities: true, --> we can use this instead of entities array
        //it auto loads all entities from all modules , 
        //and we don't have to specify them here in entities array
      };
    },
  }),
    AuthModule,
  ],
})
export class AppModule {}
