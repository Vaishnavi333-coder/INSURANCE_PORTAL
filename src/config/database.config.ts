import { registerAs } from '@nestjs/config';

export type DatabaseType = 'oracle' | 'postgres' | 'mysql' | string;

export interface DatabaseConfig {
  type: DatabaseType;
  host: string;
  port: number;
  username: string;
  password: string;
  serviceName?: string;
  synchronize: boolean;
}

/**
 * Database config read from environment with sensible defaults.
 */
export default registerAs<DatabaseConfig>('database', () => {
  const env = process.env;
  return {
    type: (env.DB_TYPE ?? 'oracle') as DatabaseType,
    host: env.DB_HOST ?? 'localhost',
    port: parseInt(env.DB_PORT ?? '1521', 10),
    username: env.DB_USERNAME ?? 'anupam',
    password: env.DB_PASSWORD ?? 'anupam123',
    serviceName: env.DB_SERVICE_NAME ?? 'FREEPDB1',
    synchronize: ((env.DB_SYNCHRONIZE ?? 'true').toLowerCase() === 'true'),
  };
});