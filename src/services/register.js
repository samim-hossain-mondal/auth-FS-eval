const { Users } = require('../../database/models');
const hashedPasswordGenerator = require('../utils/bcrypt');

const registerUser = async (email, password) => {
  const user = await Users.findOne({
    where: {
      email: email
    }
  });
  if (user) throw new Error('User already exists');
  const hashedPassword = await hashedPasswordGenerator.createHashedPassword(password);
  const newUser = await Users.create({
    email: email,
    password: hashedPassword
  });
  if (!newUser) throw new Error('User could not be created');
  return newUser;
};

module.exports = { registerUser };