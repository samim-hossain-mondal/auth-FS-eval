const validateToken = require('../services/validateToken');
const handleValidation = async (req, res,) => {
  const token = req.headers.authorization;
  try {
    const result = await validateToken.validateJWTToken(token);
    if (result.message === 'User not found') {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    return res.status(200).json({
      message: 'User validated successfully',
      email: result.email
    });
  }
  catch (err) {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }
};

module.exports = { handleValidation };