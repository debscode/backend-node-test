const redis = require("redis");
const redis_client = redis.createClient(6379, 'redis');

/**
 * Add redis client to request
 * @param req Request
 * @param res Response
 * @param next Next step on request
 */
export const redisCache = (req, res, next) => {
    req.redis = redis_client;
    next();
};
