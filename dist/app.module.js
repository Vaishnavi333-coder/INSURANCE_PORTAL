"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const claims_module_1 = require("./modules/claims/claims.module");
const policies_module_1 = require("./modules/policies/policies.module");
const users_module_1 = require("./modules/users/users.module");
const plans_module_1 = require("./modules/plans/plans.module");
const config_1 = require("@nestjs/config");
const database_config_1 = __importDefault(require("./config/database.config"));
const typeorm_1 = require("@nestjs/typeorm");
const claim_entity_1 = require("./modules/claims/entities/claim.entity");
const policy_entity_1 = require("./modules/policies/entities/policy.entity");
const user_entity_1 = require("./modules/users/entities/user.entity");
const plans_entity_1 = require("./modules/plans/entities/plans.entity");
const auth_module_1 = require("./modules/auth/auth.module");
const logger_1 = require("./common/logger");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
        imports: [logger_1.LoggerModule, claims_module_1.ClaimsModule, policies_module_1.PoliciesModule, users_module_1.UsersModule, plans_module_1.PlansModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [database_config_1.default],
                envFilePath: ['.env'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const db = config.get('database');
                    if (!db) {
                        throw new Error('Database configuration not found');
                    }
                    return {
                        type: db.type,
                        host: db.host,
                        port: db.port,
                        username: db.username,
                        password: db.password,
                        serviceName: db.serviceName,
                        entities: [policy_entity_1.Policy, claim_entity_1.Claim, user_entity_1.User, plans_entity_1.Plan],
                        synchronize: db.synchronize,
                    };
                },
            }),
            auth_module_1.AuthModule,],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map