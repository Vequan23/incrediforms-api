import Joi from 'joi';

export const INPUT_TYPES = [
  'text',
  'email',
  'number',
  'date',
  'time',
  'select',
  'radio',
  'checkbox',
  'file',
  'textarea',
];

export const CREATE_FIELD_SCHEMA = Joi.object({
  name: Joi.string().required(),
  label: Joi.string().required(),
  type: Joi.string().valid(...INPUT_TYPES).required(),
  description: Joi.string(),
  required: Joi.boolean(),
  order: Joi.number(),
});

export const UPDATE_FIELD_SCHEMA = Joi.object({
  name: Joi.string(),
  label: Joi.string(),
  description: Joi.string(),
  required: Joi.boolean(),
  order: Joi.number(),
  type: Joi.string().valid(...INPUT_TYPES),
});


export default { CREATE_FIELD_SCHEMA };