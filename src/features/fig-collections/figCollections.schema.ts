import Joi from 'joi';

export const CREATE_FIG_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required(),
});
