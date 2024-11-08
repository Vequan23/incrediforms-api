import { Request, Response } from 'express';
import { STATUS_CODES } from "@/src/lib/constants/statusCodes.constants";
import authenticationService from './authentication.service';
import { asyncWrapper } from '@/src/lib/utils/asyncWrapper';

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

export default { register: asyncWrapper(register), login: asyncWrapper(login) };
