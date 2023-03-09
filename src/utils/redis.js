const { createClient } = require('redis');

const config = {
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
};

const client = createClient(config);

client.connect().then(() => {
  console.log('Redis connected');
});

const storeToken = async (token, username) => {
  await client.set(token, username, 'EX', process.env.TOKEN_EXPIRY);
};

const getToken = async (username) => {
  const token = await client.get(username);
  console.log(token);
  return token;
};

module.exports = { storeToken, getToken };