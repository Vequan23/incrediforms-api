import Joi from 'joi';

export const CREATE_GENERATION_SCHEMA = Joi.object({
  formPrompt: Joi.string().required(),
  documentText: Joi.object().optional(),
  submission: Joi.object().required()
});
