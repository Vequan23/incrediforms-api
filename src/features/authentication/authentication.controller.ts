import { Request, Response } from 'express';
import { STATUS_CODES } from "@/src/lib/constants/statusCodes.constants";
import authenticationService from './authentication.service';
import { asyncWrapper } from '@/src/lib/utils/asyncWrapper';
import usersService from '../users/users.service';
import { RequestWithUser } from '@/src/lib/models/models';

const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const response = await authenticationService.register(email, password);
  res.status(STATUS_CODES.OK).json(response);
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;


  const response = await authenticationService.login(email, password);
  res.status(STATUS_CODES.OK).json(response);
};

const getUserByApiKey = async (req: Request, res: Response) => {
  const apiKey = req.headers['x-incredi-api-key'] as string;
  const response = await authenticationService.getUserByApiKey(apiKey);

  res.status(STATUS_CODES.OK).json(response);
};

const getUserById = async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;
  const response = await usersService.getUserById(userId);
  const user = {
    id: response.user.id,
    email: response.user.email,
    created_at: response.user.created_at,
    is_premium: response.user.stripe_user?.is_active || response.user.demo_account
  }

  res.status(STATUS_CODES.OK).json(user);
};

const continueWithGoogleAuth = async (req: Request, res: Response) => {
  const response = await authenticationService.continueWithGoogleAuth();
  res.status(STATUS_CODES.OK).json(response);
};

export default { register: asyncWrapper(register), login: asyncWrapper(login), getUserByApiKey: asyncWrapper(getUserByApiKey), getUserById: asyncWrapper(getUserById), continueWithGoogleAuth: asyncWrapper(continueWithGoogleAuth) };
