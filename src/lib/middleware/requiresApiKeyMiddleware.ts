import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '@/src/lib/constants/statusCodes.constants';
import usersService from '@/src/features/users/users.service';
import { RequestWithApiKey } from '@/src/lib/models/models';

/**
 * Description
 * Middleware to verify the token and add the user to the request object
 * If the api key is invalid, it will return a 401 Unauthorized response
 * If the api key is not found, it will return a 401 Unauthorized response
 * If the api key is not active, it will return a 401 Unauthorized response
 * If the api key is valid, it will add the api key to the request object and call the next middleware
 * @param {Request} req:Request
 * @param {Response} res:Response
 * @param {NextFunction} next:NextFunction
 * @returns {void}
 */
export const requiresApiKeyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = req.headers['x-incredi-api-key'] as string;


    if (!apiKey) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'No API key provided' });
      return;
    }

    const apiKeyExists = await usersService.getApiKey(apiKey);

    if (!apiKeyExists) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'API key not found' });
      return;
    }

    if (!apiKeyExists.is_active) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'API key is not active' });
      return;
    }

    (req as RequestWithApiKey).apiKey = { id: apiKeyExists.id };

    next();
    return;
  } catch (error) {
    res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'Invalid API key' });
    return;
  }
};
