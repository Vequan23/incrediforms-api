import Joi from 'joi';

const CREATE_SUBMISSION_SCHEMA = Joi.object({
  text: Joi.string().required().messages({
    'any.required': 'Text is required',
  }),
});

export { CREATE_SUBMISSION_SCHEMA };
