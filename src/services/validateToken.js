const jwt = require('../utils/jwt');
const redis = require('../utils/redis');

const validateJWTToken = async (token) => {
  const result = await jwt.verifyJWT(token);
  const email = result.email;
  const redisToken = await redis.getToken(email);
  if (redisToken != token) {
    throw new Error('Token not found in redis');
  }
  return result;
};

module.exports = { validateJWTToken };