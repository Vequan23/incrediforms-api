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
  'phone'
];

export const CREATE_FIELD_SCHEMA = Joi.object({
  name: Joi.string().required(),
  label: Joi.string().required(),
  type: Joi.string().valid(...INPUT_TYPES).required(),
  description: Joi.string().optional().allow(null),
  required: Joi.boolean(),
  order: Joi.number(),
});

export const UPDATE_FIELD_SCHEMA = Joi.object({
  name: Joi.string(),
  label: Joi.string(),
  description: Joi.string().optional().allow(null),
  required: Joi.boolean(),
  order: Joi.number(),
  type: Joi.string().valid(...INPUT_TYPES),
  options: Joi.array().items(Joi.string()),
});

export const REORDER_FIELDS_SCHEMA = Joi.object({
  field_ids: Joi.array().items(Joi.string()).required().messages({
    'array.base': 'Field IDs must be an array',
    'array.required': 'Field IDs are required',
  }),
});

export default { CREATE_FIELD_SCHEMA, UPDATE_FIELD_SCHEMA, REORDER_FIELDS_SCHEMA };