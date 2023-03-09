const express = require('express');
const register = require('../controllers/register');
const app = express.Router();

const schema = require('../schemas/schema');
const validate = require('../middlewares/validator');

app.route('/register')
  .post(
    validate.bodyValidator(schema.registrationSchema),
    register.handleRegistration
  );

module.exports = app;