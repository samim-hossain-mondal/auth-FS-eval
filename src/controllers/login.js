const login = require('../services/login');
const { HttpError } = require('../utils/httpError');

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await login.loginUser(email, password);
    res.status(200).json({
      message: 'User logged in successfully',
      data: result
    });
  }
  catch (err) {
    if (err instanceof HttpError) {
      res.status(401).json({
        message: 'Incorrect Password'
      });
    }
    res.status(500).json({
      message:
        'Internal server error'
    });
  }
};

module.exports = { handleLogin };