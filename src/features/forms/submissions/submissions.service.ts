import db from '@/services/db';
import { ApiError } from '@/src/lib/utils/apiError';
import { STATUS_CODES } from '@/src/lib/constants/statusCodes.constants';

const listSubmissions = async (formId: string) => {
  const submissions = await db.submission.findMany({
    where: { form_id: formId },
  });

  return submissions;
};

const createSubmission = async (formId: string, userId: string, submission: CreateSubmissionDto) => {
  const newSubmission = await db.submission.create({
    data: { ...submission, form_id: formId, user_id: userId },
  });

  if (!newSubmission) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Failed to create submission');
  }

  return newSubmission;
};

export default { listSubmissions, createSubmission };
