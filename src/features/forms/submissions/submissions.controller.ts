import { STATUS_CODES } from '@/src/lib/constants/statusCodes.constants';
import { Request, Response } from 'express';
import submissionsService from './submissions.service';
import { RequestWithUser } from '@/src/lib/models/models';
import { asyncWrapper } from '@/src/lib/utils/asyncWrapper';

interface ListSubmissionsRequest extends Request {
  params: {
    id: string;
  };
}
interface CreateSubmissionRequest extends RequestWithUser {
  params: {
    id: string;
  };
}

const listSubmissions = async (req: ListSubmissionsRequest, res: Response) => {
  const { id: formId } = req.params;

  const submissions = await submissionsService.listSubmissions(formId);
  res.status(STATUS_CODES.OK).json(submissions);

};

const createSubmission = async (req: CreateSubmissionRequest, res: Response) => {
  const { id: formId } = req.params;
  const userId = req.user!.id;

  //const submission = await submissionsService.createSubmission(formId, userId, req.body);
  res.status(STATUS_CODES.OK).json('Submission created (TEMP)');
};

export default {
  listSubmissions: asyncWrapper(listSubmissions),
  createSubmission: asyncWrapper(createSubmission),
};
