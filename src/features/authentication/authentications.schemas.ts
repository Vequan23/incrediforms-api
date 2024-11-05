import Joi from 'joi';

export const CREDENTIALS_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
