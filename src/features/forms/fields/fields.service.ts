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

const updateField = async (field_id: string, form: UpdateFieldDto) => {
  const existingField = await db.field.findUnique({
    where: { id: field_id },
  });

  if (!existingField) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Field not found');
  }

  return db.field.update({
    where: { id: field_id },
    data: form,
  });
};

const listFields = async (formId: string) => {
  return db.field.findMany({ where: { form_id: formId } });
};

const reorderFields = async (field_ids: string[]) => {
  return db.$transaction(
    field_ids.map((id, index) =>
      db.field.update({
        where: { id },
        data: { order: index },
      })
    )
  );
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

export default { createField, updateField, deleteField, listFields, reorderFields };
