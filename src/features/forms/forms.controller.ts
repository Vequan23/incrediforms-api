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

const listForms = async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;
  const nameParam = req.query.name as string | undefined;
  const forms = await formsService.listForms(userId, nameParam);

  res.status(STATUS_CODES.OK).json(forms);
};

const deleteForm = async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;
  try {
    const form = await formsService.deleteForm(userId, req.params.id);

    res.status(STATUS_CODES.OK).json(form);
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Failed to delete form' });
  }
};

const publishForm = async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;
  const encodedContent = req.body.encoded_content;
  const form = await formsService.publishForm(userId, req.params.id, encodedContent);

  res.status(STATUS_CODES.OK).json(form);
};

const getPublishedForm = async (req: RequestWithUser, res: Response) => {
  const form = await formsService.getPublishedForm(req.params.id);

  res.status(STATUS_CODES.OK).json(form);
};

export default {
  create: asyncWrapper(create),
  update: asyncWrapper(update),
  getById: asyncWrapper(getById),
  listForms: asyncWrapper(listForms),
  deleteForm: asyncWrapper(deleteForm),
  publishForm: asyncWrapper(publishForm),
  getPublishedForm: asyncWrapper(getPublishedForm),
};
