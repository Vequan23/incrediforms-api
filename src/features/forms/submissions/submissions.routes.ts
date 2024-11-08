import { Router } from 'express';
import submissionsController from './submissions.controller';
import { schemaValidatorMiddleware } from '@/middleware/schemaValidatorMiddleware';
import { CREATE_SUBMISSION_SCHEMA } from './submissions.schemas';

const router = Router();

router.get('/', submissionsController.listSubmissions);
router.post(
  '/',
  schemaValidatorMiddleware(CREATE_SUBMISSION_SCHEMA),
  submissionsController.createSubmission
);

export default router;
