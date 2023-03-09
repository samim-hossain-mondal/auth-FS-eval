const register = require('../services/register');

const handleRegistration = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await register.registerUser(email, password);
    res.status(201).json({
      message: 'User created successfully',
      data: result
    });
  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(409).json({
        message: 'User already exists',
        error: error
      });
    } else {
      res.status(500).json({
        message: 'Error creating user',
        error: error
      });
    }
  }
};

module.exports = { handleRegistration };