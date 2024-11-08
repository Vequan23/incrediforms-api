import Joi from 'joi';

export const CREDENTIALS_SCHEMA = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});
