import db from '@/services/db';
import { CreateFormDto, UpdateFormDto } from './forms.models';
import { STATUS_CODES } from '@/src/lib/constants/statusCodes.constants';
import { ApiError } from '@/src/lib/utils/apiError';

const createForm = async (userId: string, form: CreateFormDto) => {
  return db.form.create({
    data: { ...form, user_id: userId },
  });
};

const updateForm = async (userId: string, formId: string, form: UpdateFormDto) => {
  const existingForm = await db.form.findUnique({
    where: { id: formId, user_id: userId },
  });

  if (!existingForm) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Form not found');
  }

  return db.form.update({
    where: { id: formId, user_id: userId },
    data: form,
  });
};

const getFormById = async (id: string) => {
  const form = await db.form.findUnique({
    where: { id },
  });

  if (!form) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Form not found');
  }

  return form;
};

const listForms = async (userId: string, nameParam?: string) => {
  return db.form.findMany({ where: { user_id: userId, name: { contains: nameParam } } });
};

const deleteForm = async (userId: string, formId: string) => {
  return db.form.delete({
    where: { id: formId, user_id: userId },
  });
};

const publishForm = async (userId: string, formId: string, encodedContent: string) => {
  return db.publishedForm.create({
    data: { form_id: formId, encoded_content: encodedContent, user_id: userId },
  });
};

const getPublishedForm = async (formId: string) => {
  return db.publishedForm.findFirst({
    where: { form_id: formId },
  });
};

export default { createForm, updateForm, getFormById, listForms, deleteForm, publishForm, getPublishedForm };
