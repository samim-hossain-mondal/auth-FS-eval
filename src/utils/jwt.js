const { Users } = require('../../database/models');
const jwt = require('jsonwebtoken');

const generateJWT = (user) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(user, jwtSecretKey, { expiresIn: '1h' });
  return token;
};

const verifyJWT = async (token) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  const decodedToken = jwt.verify(token, jwtSecretKey);
  const user = await Users.findOne({
    where: {
      username: decodedToken.username,
    }
  });
  if (!user) {
    return {
      message: 'User not found'
    };
  }
  return {
    username: user.username,
    message: 'User verified',
  };
};

module.exports = { generateJWT, verifyJWT };