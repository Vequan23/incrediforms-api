import { Response } from 'express';
import { STATUS_CODES } from '@/src/lib/constants/statusCodes.constants';
import formsService from './forms.service';
import { RequestWithUser } from '@/src/lib/models/models';
import { asyncWrapper } from '@/src/lib/utils/asyncWrapper';


const create = async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;
  const form = await formsService.createForm(userId, req.body);

  res.status(STATUS_CODES.OK).json(form);
};

const update = async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;

  const form = await formsService.updateForm(userId, req.params.id, req.body);

  res.status(STATUS_CODES.OK).json(form);
};

const getById = async (req: RequestWithUser, res: Response) => {
  const form = await formsService.getFormById(req.params.id);

  res.status(STATUS_CODES.OK).json(form);
};

export default { create: asyncWrapper(create), update: asyncWrapper(update), getById: asyncWrapper(getById) };
