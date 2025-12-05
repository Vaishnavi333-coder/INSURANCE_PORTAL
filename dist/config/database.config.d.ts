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
declare const _default: import("@nestjs/config").ConfigFactory<DatabaseConfig> & import("@nestjs/config").ConfigFactoryKeyHost<DatabaseConfig | Promise<DatabaseConfig>>;
export default _default;
