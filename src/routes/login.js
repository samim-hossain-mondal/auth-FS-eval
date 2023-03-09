const express = require('express');
const app = express.Router();

const validate = require('../middlewares/validator');
const schema = require('../schemas/schema');
const login = require('../controllers/login');

app.route('/login')
  .post(
    validate.bodyValidator(schema.loginSchema),
    login.handleLogin
  );

module.exports = app;