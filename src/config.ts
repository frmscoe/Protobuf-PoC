import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file into process.env if it exists. This is convenient for running locally.
dotenv.config({
    path: path.resolve(__dirname, '../.env'),
});

export interface IConfig {
    serverUrl: string;
    iterations: number;
    env: string;
    functionName: string;
    delay: number;
    redisConfig: RedisConfig;
}

export interface RedisConfig {
    db: number;
    servers: Array<{
        host: string;
        port: number;
    }>;
    password: string;
    isCluster: boolean;
}

export const configuration: IConfig = {
    iterations: parseInt(process.env.ITERATIONS!, 10) || 1000,
    env: <string>process.env.NODE_ENV,
    serverUrl: <string>process.env.SERVER_URL,
    functionName: <string>process.env.FUNCTION_NAME,
    delay: parseInt(process.env.DELAY!, 10) || 100,
    redisConfig: {
        db: parseInt(process.env.REDIS_DB!, 10) || 0,
        servers: JSON.parse((process.env.REDIS_SERVERS as string) || '[{"hostname": "127.0.0.1", "port":6379}]'),
        password: process.env.REDIS_AUTH as string,
        isCluster: process.env.REDIS_IS_CLUSTER === 'true',
    }
}
