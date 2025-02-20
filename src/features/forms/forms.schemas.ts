import Joi from "joi";

const CREATE_FORM_SCHEMA = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  prompt: Joi.string().optional(),
  file: Joi.string().optional(),
});

const UPDATE_FORM_SCHEMA = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional().allow(''),
  prompt: Joi.string().optional().allow(''),
  file: Joi.string().allow(null).optional(),
  theme_color: Joi.string().optional(),
  webhook_url: Joi.string().optional(),
});

const CREATE_PROMPT_FILE_SCHEMA = Joi.object({
  title: Joi.string().required(),
  base64_content: Joi.string().required(),
});

export { CREATE_FORM_SCHEMA, UPDATE_FORM_SCHEMA, CREATE_PROMPT_FILE_SCHEMA };
