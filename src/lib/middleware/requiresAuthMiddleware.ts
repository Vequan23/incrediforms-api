import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '@/src/lib/constants/statusCodes.constants';
import usersService from '@/src/features/users/users.service';
import { RequestWithUser } from '@/src/lib/models/models';

export interface JWTPayload {
  id: string;
  iat?: number;
  exp?: number;
}

/**
 * Description
 * Middleware to verify the token and add the user to the request object
 * If the token is invalid, it will return a 401 Unauthorized response
 * If the user is not found, it will return a 401 Unauthorized response
 * If the token is valid, it will add the user to the request object and call the next middleware
 * @param {Request} req:Request
 * @param {Response} res:Response
 * @param {NextFunction} next:NextFunction
 * @returns {void}
 */
export const requiresAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'No token provided' });
      return;
    }

    const tokenWithoutBearer = token.split(' ')[1];

    if (!process.env.JWT_SECRET) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'JWT_SECRET is not defined' });
      return;
    }

    const decoded = jwt.verify(
      tokenWithoutBearer,
      process.env.JWT_SECRET as string
    ) as JWTPayload;


    // Check existing user
    const user = await usersService.getUserById(decoded.id);

    if (!user) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'User not found' });
      return;
    }

    (req as RequestWithUser).user = { id: decoded.id };

    next();
    return;
  } catch (error) {
    res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'Invalid token' });
    return;
  }
};

