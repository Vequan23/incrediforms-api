import db from '@/services/db';
import { CreateFormDto, CreatePromptFileDto, UpdateFormDto } from './forms.models';
import { STATUS_CODES } from '@/src/lib/constants/statusCodes.constants';
import { ApiError } from '@/src/lib/utils/apiError';
import { extractTextFromBase64Pdf } from './extractTextFromBase64Pdf';

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
  const existingPublishedForm = await db.publishedForm.findFirst({
    where: { form_id: formId, user_id: userId },
  });

  if (existingPublishedForm) {
    return db.publishedForm.update({
      where: { id: existingPublishedForm.id },
      data: { encoded_content: encodedContent },
    });
  }

  return db.publishedForm.create({
    data: {
      form_id: formId,
      user_id: userId,
      encoded_content: encodedContent,
    },
  });
};

const getPublishedForm = async (formId: string) => {
  return db.publishedForm.findFirst({
    where: { form_id: formId },
  });
};

const createPromptFile = async (formId: string, promptFile: CreatePromptFileDto) => {
  const fileMetadata = {
    title: promptFile.title,
    base64_content: promptFile.base64_content,
    extracted_text: await extractTextFromBase64Pdf(promptFile.base64_content),
  };

  try {
    const createdPromptFile = await db.promptFile.create({
      data: { form_id: formId, ...fileMetadata },
    });

    return createdPromptFile;
  } catch (error) {
    console.error(error);
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Failed to create prompt file');
  }
};

export default {
  createForm,
  updateForm,
  getFormById,
  listForms,
  deleteForm,
  publishForm,
  getPublishedForm,
  createPromptFile,
};
