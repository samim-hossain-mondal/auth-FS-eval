const express = require('express');
const app = express.Router();

const validate = require('../middlewares/validator');
const validateToken = require('../controllers/validateToken');

app.route('/token/validate')
  .post(validate.authHeaderValidator, validateToken.handleValidation);

module.exports = app;