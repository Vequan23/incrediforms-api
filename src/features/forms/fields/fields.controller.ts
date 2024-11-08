import { STATUS_CODES } from "@/src/lib/constants/statusCodes.constants";
import { Response, Request } from 'express';

import fieldsService from './fields.service';
import { asyncWrapper } from '@/src/lib/utils/asyncWrapper';

const createField = async (req: Request, res: Response) => {
  const { id: formId } = req.params;

  const field = await fieldsService.createField(formId, req.body);
  res.status(STATUS_CODES.OK).json(field);
};

const updateField = async (req: Request, res: Response) => {
  const { fieldId } = req.params;

  const field = await fieldsService.updateField(fieldId, req.body);
  res.status(STATUS_CODES.OK).json(field);
};

const deleteField = async (req: Request, res: Response) => {
  const { id } = req.params;

  const field = await fieldsService.deleteField(id);
  res.status(STATUS_CODES.OK).json(field);
};

export default { createField: asyncWrapper(createField), updateField: asyncWrapper(updateField), deleteField: asyncWrapper(deleteField) };

