import Joi from 'joi';


const CREATE_SCHEDULED_REPORT_SCHEMA = Joi.object({
  form_id: Joi.string().optional(),
  name: Joi.string().optional(),
  frequency: Joi.string().optional(),
  date_range: Joi.string().optional(),
  prompt: Joi.string().optional(),
  email_address: Joi.string().optional(),
});


export { CREATE_SCHEDULED_REPORT_SCHEMA };
