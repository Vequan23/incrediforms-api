import db from '@/services/db';
import { CreateFormDto, CreatePromptFileDto, UpdateFormDto } from './forms.models';
import { STATUS_CODES } from '@/src/lib/constants/statusCodes.constants';
import { ApiError } from '@/src/lib/utils/apiError';
import { extractTextFromBase64Pdf } from './extractTextFromBase64Pdf';
import { Field } from '@prisma/client';
import { CreateFieldDto } from './fields/fields.models';

const createForm = async (userId: string, form: CreateFormDto) => {
  return db.form.create({
    data: { ...form, user_id: userId },
  });
};

const updateForm = async (userId: string, formId: string, form: UpdateFormDto) => {
  const formBodyWithoutWebhookUrl = { ...form, webhook_url: undefined };

  const existingForm = await db.form.findUnique({
    where: { id: formId, user_id: userId },
  });

  const webhook = await db.webhook.findUnique({
    where: { form_id: formId },
  });

  if (form.webhook_url) {
    if (webhook) {
      await db.webhook.update({
        where: { id: webhook.id },
        data: { url: form.webhook_url },
      });
    } else {
      await db.webhook.create({
        data: { form_id: formId, url: form.webhook_url },
      });
    }
  }

  if (!existingForm) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Form not found');
  }

  return db.form.update({
    where: { id: formId, user_id: userId },
    data: { ...formBodyWithoutWebhookUrl, webhook_id: webhook?.id },
  });
};

const getFormById = async (id: string) => {
  const form = await db.form.findUnique({
    where: { id },
    include: {
      PromptFile: true,
      Webhook: true,
    },
  });

  if (!form) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Form not found');
  }

  return {
    ...form,
    prompt_file: form.PromptFile,
    PromptFile: undefined,
    webhook_id: undefined,
    webhook: form.Webhook,
    Webhook: undefined,
  };
};

const listForms = async (userId: string, nameParam?: string) => {
  const forms = await db.form.findMany({
    where: { user_id: userId, name: { contains: nameParam } },
    include: { PromptFile: true, Webhook: true },
  });

  return forms.map(form => ({
    ...form,
    prompt_file: form.PromptFile,
    PromptFile: undefined,
    webhook_id: undefined,
    Webhook: undefined,
    webhook: {
      ...form.Webhook,
      api_key: undefined,
    },
  }));
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
      data: { encoded_content: encodedContent, last_published_at: new Date() },
    });
  }

  return db.publishedForm.create({
    data: {
      form_id: formId,
      user_id: userId,
      encoded_content: encodedContent,
      last_published_at: new Date(),
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
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Failed to create prompt file');
  }
};

const deletePromptFile = async (formId: string, promptFileId: string) => {
  const promptFile = await db.promptFile.findUnique({
    where: { id: promptFileId, form_id: formId },
  });

  if (!promptFile) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Prompt file not found');
  }

  return db.promptFile.delete({
    where: { id: promptFileId, form_id: formId },
  });
};

const generateFromPrompt = async (userId: string, formId: string, form: any) => {
  const formBody = {
    name: form.object.name,
    description: form.object.description,
    prompt: form.object.submissionPrompt,
  } as UpdateFormDto;

  const updatedForm = await db.$transaction(async (tx) => {
    const updated = await updateForm(userId, formId, formBody);

    const bulkAddFields = form.object.fields.map((field: CreateFieldDto) => ({
      form_id: formId,
      name: field.name,
      type: field.type,
      required: field.required,
      options: field.options,
      order: field.order,
      label: field.label,
    })) as CreateFieldDto[];

    await tx.field.deleteMany({
      where: { form_id: formId },
    });

    await tx.field.createMany({
      data: bulkAddFields,
    });

    return updated;
  });

  if (!updatedForm) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Form not found');
  }

  return updatedForm;
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
  deletePromptFile,
  generateFromPrompt,
};
