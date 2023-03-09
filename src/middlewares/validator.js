const bodyValidator = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      req.body = value;
      next();
    }
  };
};

const authHeaderValidator = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    next();
  } else {
    res.status(401).json({ message: 'Token not found' });
  }
};

module.exports = { bodyValidator, authHeaderValidator };