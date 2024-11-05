import { STATUS_CODES } from '@/constants/statusCodes.constants';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const schemaValidatorMiddleware = <TSchema>(schema: Joi.ObjectSchema<TSchema>) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message });
    return;
  }
  next();
};

