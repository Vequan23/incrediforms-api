import Joi from 'joi';

export const CREATE_GENERATION_SCHEMA = Joi.object({
  fig_collection_id: Joi.string().required(),
  submission: Joi.object().required(),
  stream: Joi.boolean().optional()
});
