const { Users } = require('../../database/models');
const { HttpError } = require('../utils/httpError');
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');
const redis = require('../utils/redis');

const loginUser = async (email, password) => {
  const user = await Users.findOne({
    where: {
      email: email
    }
  });

  if (user === null) {
    throw new HttpError('User not found');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new HttpError('Incorrect password');
  }

  const userData = {
    id: user.id,
    email: user.email,
  };

  const tokenGenerated = jwt.generateJWT(userData);
  await redis.storeToken(email, tokenGenerated);
  return tokenGenerated;
};

module.exports = { loginUser };