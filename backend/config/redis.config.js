const redis = require('redis');
const logger = require('../logger');

let redisClient = null;
let isRedisAvailable = false;

const DEFAULT_TTL_SECONDS = Number(process.env.REDIS_DEFAULT_TTL_SECONDS || 3600);
const MAX_TTL_SECONDS = Number(process.env.REDIS_MAX_TTL_SECONDS || 7 * 24 * 3600);
const SCAN_COUNT = Number(process.env.REDIS_SCAN_COUNT || 100);

const normalizeTtl = (ttlSeconds = DEFAULT_TTL_SECONDS) => {
  const ttl = Number(ttlSeconds || DEFAULT_TTL_SECONDS);
  if (!Number.isFinite(ttl) || ttl <= 0) return DEFAULT_TTL_SECONDS;
  return Math.min(ttl, MAX_TTL_SECONDS);
};

const parseCacheValue = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    logger.warn('Redis cache value is not valid JSON', { error: error.message });
    return null;
  }
};

const createRedisClient = async () => {
  if (redisClient) return redisClient;

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  try {
    redisClient = redis.createClient({
      url: redisUrl,
      socket: {
        connectTimeout: Number(process.env.REDIS_CONNECT_TIMEOUT_MS || 5000),
        reconnectStrategy: (retries) => {
          if (retries > Number(process.env.REDIS_MAX_RECONNECT_RETRIES || 10)) {
            logger.error('Redis: max reconnection attempts reached');
            return new Error('Redis reconnection failed');
          }
          return Math.min(retries * 100, 3000);
        },
      },
    });

    redisClient.on('error', (err) => {
      isRedisAvailable = false;
      logger.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      isRedisAvailable = true;
      logger.info('Redis connected successfully');
    });

    redisClient.on('ready', () => {
      isRedisAvailable = true;
      logger.info('Redis client ready');
    });

    redisClient.on('reconnecting', () => {
      isRedisAvailable = false;
      logger.warn('Redis reconnecting...');
    });

    redisClient.on('end', () => {
      isRedisAvailable = false;
      logger.warn('Redis connection closed');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    isRedisAvailable = false;
    logger.error('Redis connection failed:', error.message);
    logger.warn('Running without Redis cache - performance may be degraded');
    return null;
  }
};

const getRedisClient = () => redisClient;

const isRedisReady = () => Boolean(isRedisAvailable && redisClient?.isReady);

const cacheGet = async (key) => {
  if (!isRedisReady()) return null;
  try {
    return parseCacheValue(await redisClient.get(key));
  } catch (error) {
    logger.error(`Redis GET error for key ${key}:`, error);
    return null;
  }
};

const cacheSet = async (key, value, ttlSeconds = DEFAULT_TTL_SECONDS) => {
  if (!isRedisReady()) return false;
  try {
    await redisClient.setEx(key, normalizeTtl(ttlSeconds), JSON.stringify(value));
    return true;
  } catch (error) {
    logger.error(`Redis SET error for key ${key}:`, error);
    return false;
  }
};

const cacheDel = async (key) => {
  if (!isRedisReady()) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error(`Redis DEL error for key ${key}:`, error);
    return false;
  }
};

const scanKeys = async (pattern) => {
  if (!isRedisReady()) return [];

  const found = [];

  try {
    if (typeof redisClient.scanIterator === 'function') {
      const iterator = redisClient.scanIterator({ MATCH: pattern, COUNT: SCAN_COUNT });
      for await (const key of iterator) {
        found.push(key);
      }
      return found;
    }

    let cursor = '0';
    do {
      const result = await redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', SCAN_COUNT);
      cursor = result.cursor;
      found.push(...result.keys);
    } while (cursor !== '0');

    return found;
  } catch (error) {
    logger.error(`Redis SCAN error for pattern ${pattern}:`, error);
    return [];
  }
};

const cacheDelPattern = async (pattern) => {
  if (!isRedisReady()) return false;

  try {
    const keys = await scanKeys(pattern);
    if (!keys.length) return true;

    const batchSize = 500;
    for (let index = 0; index < keys.length; index += batchSize) {
      await redisClient.del(keys.slice(index, index + batchSize));
    }

    return true;
  } catch (error) {
    logger.error(`Redis DEL pattern error for ${pattern}:`, error);
    return false;
  }
};

module.exports = {
  createRedisClient,
  getRedisClient,
  isRedisReady,
  cacheGet,
  cacheSet,
  cacheDel,
  cacheDelPattern,
  scanKeys,
};
