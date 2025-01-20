import Joi from 'joi';

export const CREATE_GENERATION_SCHEMA = Joi.object({
  form_prompt: Joi.string().required(),
  document_text: Joi.object().optional(),
  submission: Joi.object().required()
});
