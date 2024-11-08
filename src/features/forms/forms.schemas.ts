import Joi from "joi";

const CREATE_FORM_SCHEMA = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  prompt: Joi.string().optional(),
  file: Joi.string().optional(),
});

const UPDATE_FORM_SCHEMA = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  prompt: Joi.string().optional(),
  file: Joi.string().optional(),
});

export { CREATE_FORM_SCHEMA, UPDATE_FORM_SCHEMA };
