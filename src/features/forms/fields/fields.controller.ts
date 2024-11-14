import { STATUS_CODES } from "@/src/lib/constants/statusCodes.constants";
import { Response, Request } from 'express';

import fieldsService from './fields.service';
import { asyncWrapper } from '@/src/lib/utils/asyncWrapper';


const listFields = async (req: Request, res: Response) => {
  const { id: formId } = req.params;

  const fields = await fieldsService.listFields(formId);
  res.status(STATUS_CODES.OK).json(fields);
};

const createField = async (req: Request, res: Response) => {
  const { id: formId } = req.params;

  const field = await fieldsService.createField(formId, req.body);
  res.status(STATUS_CODES.OK).json(field);
};

const updateField = async (req: Request, res: Response) => {
  const { field_id } = req.params;

  const field = await fieldsService.updateField(field_id, req.body);
  res.status(STATUS_CODES.OK).json(field);
};

const deleteField = async (req: Request, res: Response) => {
  const { field_id } = req.params;

  const field = await fieldsService.deleteField(field_id);
  res.status(STATUS_CODES.OK).json(field);
};

const reorderFields = async (req: Request, res: Response) => {
  const { field_ids } = req.body;

  const fields = await fieldsService.reorderFields(field_ids);
  res.status(STATUS_CODES.OK).json(fields);
};

export default { createField: asyncWrapper(createField), updateField: asyncWrapper(updateField), deleteField: asyncWrapper(deleteField), listFields: asyncWrapper(listFields), reorderFields: asyncWrapper(reorderFields) };

