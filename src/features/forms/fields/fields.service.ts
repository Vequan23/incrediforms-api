import db from '@/services/db';
import { CreateFieldDto, UpdateFieldDto } from './fields.models';
import formsService from '@/features/forms/forms.service';
import { ApiError } from '@/src/lib/utils/apiError';
import { STATUS_CODES } from '@/src/lib/constants/statusCodes.constants';

const createField = async (formId: string, field: CreateFieldDto) => {
  const existingForm = await formsService.getFormById(formId);


  const createdField = await db.field.create({
    data: { ...field, form_id: existingForm.id },
  });

  if (!createdField) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Failed to create field');
  }

  return createdField;
};

const updateField = async (field_id: string, field: UpdateFieldDto) => {
  const existingField = await db.field.findUnique({
    where: { id: field_id },
  });

  const relatedOptions = await db.fieldOption.findMany({
    where: { field_id: field_id },
  });

  if (relatedOptions.length > 0) {
    await db.fieldOption.deleteMany({ where: { field_id: field_id } });
  }

  if (field.options) {
    await db.fieldOption.createMany({
      data: field.options.map((option) => ({ name: option, field_id })),
    });
  }

  if (!existingField) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Field not found');
  }

  const fieldCopy = { ...field };
  delete fieldCopy.options;

  return db.field.update({
    where: { id: field_id },
    data: { ...fieldCopy },
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

const listFieldOptions = async (field_id: string) => {
  return db.fieldOption.findMany({ where: { field_id } });
};

export default {
  createField,
  updateField,
  deleteField,
  listFields,
  reorderFields,
  listFieldOptions,
};
