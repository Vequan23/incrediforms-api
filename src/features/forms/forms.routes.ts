import express from 'express';

import { schemaValidatorMiddleware } from '@/middleware/schemaValidatorMiddleware';

import formsController from './forms.controller';
import { requiresAuthMiddleware } from '@/src/lib/middleware/requiresAuthMiddleware';
import { CREATE_FORM_SCHEMA, UPDATE_FORM_SCHEMA } from './forms.schemas';
import fieldsController from './fields/fields.controller';
import { CREATE_FIELD_SCHEMA, UPDATE_FIELD_SCHEMA } from './fields/fields.schemas';
import submissionsController from './submissions/submissions.controller';
const router = express.Router();

router.post(
  '/',
  schemaValidatorMiddleware(CREATE_FORM_SCHEMA),
  requiresAuthMiddleware,
  formsController.create
);

router.patch(
  '/:id',
  schemaValidatorMiddleware(UPDATE_FORM_SCHEMA),
  requiresAuthMiddleware,
  formsController.update
);

router.get('/:id', requiresAuthMiddleware, formsController.getById);

router.post(
  '/:id/fields',
  schemaValidatorMiddleware(CREATE_FIELD_SCHEMA),
  requiresAuthMiddleware,
  fieldsController.createField
);

router.patch(
  '/:id/fields/:fieldId',
  schemaValidatorMiddleware(UPDATE_FIELD_SCHEMA),
  requiresAuthMiddleware,
  fieldsController.updateField
);

router.delete(
  '/:id/fields/:fieldId',
  requiresAuthMiddleware,
  fieldsController.deleteField
);

router.get('/:id/submissions', requiresAuthMiddleware, submissionsController.listSubmissions);
router.post('/:id/submissions', requiresAuthMiddleware, submissionsController.createSubmission);

export default router;
