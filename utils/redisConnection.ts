// const Redis = require("ioredis");
import Redis from 'ioredis';

export const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
});
redisClient.on('error', (error: unknown) => {
    console.error('[Redis] Error', error);
});
