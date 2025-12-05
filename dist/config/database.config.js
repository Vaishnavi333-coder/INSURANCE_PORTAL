"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('database', () => {
    const env = process.env;
    return {
        type: (env.DB_TYPE ?? 'oracle'),
        host: env.DB_HOST ?? 'localhost',
        port: parseInt(env.DB_PORT ?? '1521', 10),
        username: env.DB_USERNAME ?? 'anupam',
        password: env.DB_PASSWORD ?? 'anupam123',
        serviceName: env.DB_SERVICE_NAME ?? 'FREEPDB1',
        synchronize: ((env.DB_SYNCHRONIZE ?? 'true').toLowerCase() === 'true'),
    };
});
//# sourceMappingURL=database.config.js.map