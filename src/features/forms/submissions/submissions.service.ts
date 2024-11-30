import db from '@/services/db';
import { ApiError } from '@/src/lib/utils/apiError';
import { STATUS_CODES } from '@/src/lib/constants/statusCodes.constants';

const listSubmissions = async (formId: string) => {
  const submissions = await db.submission.findMany({
    where: { form_id: formId },
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

  return newSubmission;
};

export default { listSubmissions, createSubmission };
