const bcrypt = require('bcrypt');

const createHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(process.env.NUMBER_OF_SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

module.exports = { createHashedPassword };