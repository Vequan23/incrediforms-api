import db from '@/services/db';
import { CreateFieldDto, UpdateFieldDto } from './fields.models';
import formsService from '@/features/forms/forms.service';
import { ApiError } from '@/src/lib/utils/apiError';
import { STATUS_CODES } from '@/src/lib/constants/statusCodes.constants';

const createField = async (formId: string, form: CreateFieldDto) => {
  const existingForm = await formsService.getFormById(formId);


  const field = await db.field.create({
    data: { ...form, form_id: existingForm.id },
  });

  if (!field) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Failed to create field');
  }

  return field;
};

const updateField = async (fieldId: string, form: UpdateFieldDto) => {
  const existingField = await db.field.findUnique({
    where: { id: fieldId },
  });

  if (!existingField) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Field not found');
  }

  return db.field.update({
    where: { id: fieldId },
    data: form,
  });
};

const listFields = async (formId: string) => {
  return db.field.findMany({ where: { form_id: formId } });
};

const deleteField = async (id: string) => {
  const existingField = await db.field.findUnique({
    where: { id },
  });

  if (!existingField) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Field not found');
  }

  return db.field.delete({
    where: { id },
  });
};

export default { createField, updateField, deleteField, listFields };
