const { cacheGet, cacheSet, isRedisReady } = require('../config/redis.config');
const logger = require('../logger');

const CACHE_VERSION = process.env.CACHE_KEY_VERSION || 'v1';

const buildCacheKey = (req, keyGenerator) => {
  const baseKey = keyGenerator ? keyGenerator(req) : `${req.method}:${req.originalUrl || req.url}`;
  return `${CACHE_VERSION}:${baseKey}`;
};

const cacheMiddleware = (ttl = 300, keyGenerator = null) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') return next();
    if (!isRedisReady()) return next();

    try {
      const cacheKey = buildCacheKey(req, keyGenerator);
      const cachedData = await cacheGet(cacheKey);

      if (cachedData) {
        logger.debug(`Cache HIT: ${cacheKey}`);
        res.set('X-Cache', 'HIT');
        res.set('X-Cache-Key', cacheKey);
        return res.json(cachedData);
      }

      logger.debug(`Cache MISS: ${cacheKey}`);
      res.set('X-Cache', 'MISS');
      res.set('X-Cache-Key', cacheKey);

      const originalJson = res.json.bind(res);
      res.json = (data) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          cacheSet(cacheKey, data, ttl).catch((error) => {
            logger.error('Cache set error:', error);
          });
        }
        return originalJson(data);
      };

      return next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      return next();
    }
  };
};

const cacheInvalidationMiddleware = (patterns = []) => {
  return async (req, res, next) => {
    const { cacheDel, cacheDelPattern } = require('../config/redis.config');
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);

    const invalidateCache = async () => {
      if (!isRedisReady()) return;

      try {
        for (const pattern of patterns) {
          const key = typeof pattern === 'function' ? pattern(req) : pattern;
          if (!key) continue;

          if (key.includes('*')) {
            await cacheDelPattern(key);
            logger.debug(`Cache invalidated (pattern): ${key}`);
          } else {
            await cacheDel(key);
            logger.debug(`Cache invalidated: ${key}`);
          }
        }
      } catch (error) {
        logger.error('Cache invalidation error:', error);
      }
    };

    res.json = (data) => {
      invalidateCache().catch((error) => {
        logger.error('Cache invalidation failed:', error);
      });
      return originalJson(data);
    };

    res.send = (data) => {
      invalidateCache().catch((error) => {
        logger.error('Cache invalidation failed:', error);
      });
      return originalSend(data);
    };

    next();
  };
};

module.exports = {
  cacheMiddleware,
  cacheInvalidationMiddleware,
};
