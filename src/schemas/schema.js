const Joi = require('joi');

const registrationSchema = Joi.object({
  email: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(8).max(30).required()
});

const loginSchema = Joi.object({
  email: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(8).max(30).required()
});

module.exports = { registrationSchema, loginSchema };