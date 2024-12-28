import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../constants/statusCodes.constants';

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error(err);

  return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    error: 'Internal server error. Please try again later.'
  });
};