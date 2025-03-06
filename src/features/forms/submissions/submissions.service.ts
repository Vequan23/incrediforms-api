import db from '@/services/db';
import { ApiError } from '@/src/lib/utils/apiError';
import { STATUS_CODES } from '@/src/lib/constants/statusCodes.constants';
import { callWebhook } from '../webhook-integrator/webhooks.service';
import { DateRange } from '../scheduled-reports/scheduled-reports.service';

const DATE_RANGE_TO_GTE = {
  [DateRange.LAST_24_HOURS]: new Date(Date.now() - 24 * 60 * 60 * 1000),
  [DateRange.LAST_7_DAYS]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  [DateRange.LAST_30_DAYS]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
};

const listSubmissions = async (formId: string, dateRange?: DateRange) => {
  const submissions = await db.submission.findMany({
    where: { form_id: formId, created_at: { gte: dateRange ? DATE_RANGE_TO_GTE[dateRange] : undefined } },
    orderBy: { created_at: 'desc' },
  });

  return submissions;
};

const createSubmission = async (formId: string, submission: CreateSubmissionDto) => {
  const stringifiedSubmission = JSON.stringify(submission);
  const newSubmission = await db.submission.create({
    data: { text: stringifiedSubmission, form_id: formId },
  });

  if (!newSubmission) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Failed to create submission');
  }

  await callWebhook(formId, submission);

  return newSubmission;
};

export default { listSubmissions, createSubmission };
