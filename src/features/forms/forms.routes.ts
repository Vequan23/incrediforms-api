import express from 'express';

// Middleware imports
import { schemaValidatorMiddleware } from '@/middleware/schemaValidatorMiddleware';
import { requiresAuthMiddleware } from '@/src/lib/middleware/requiresAuthMiddleware';

// Controller imports
import formsController from './forms.controller';
import fieldsController from './fields/fields.controller';
import submissionsController from './submissions/submissions.controller';

// Schema imports
import { CREATE_FORM_SCHEMA, UPDATE_FORM_SCHEMA } from './forms.schemas';
import { CREATE_FIELD_SCHEMA, UPDATE_FIELD_SCHEMA } from './fields/fields.schemas';

const router = express.Router();

// Form routes
router
  .route('/')
  .post(
    schemaValidatorMiddleware(CREATE_FORM_SCHEMA),
    requiresAuthMiddleware,
    formsController.create
  )
  .get(requiresAuthMiddleware, formsController.listForms);

router
  .route('/:id')
  .get(requiresAuthMiddleware, formsController.getById)
  .patch(
    schemaValidatorMiddleware(UPDATE_FORM_SCHEMA),
    requiresAuthMiddleware,
    formsController.update
  )
  .delete(requiresAuthMiddleware, formsController.deleteForm);


router
  .route('/:id/published')
  .get(requiresAuthMiddleware, formsController.getPublishedForm)
  .post(requiresAuthMiddleware, formsController.publishForm);

// Field routes
router
  .route('/:id/fields')
  .get(requiresAuthMiddleware, fieldsController.listFields)
  .post(
    schemaValidatorMiddleware(CREATE_FIELD_SCHEMA),
    requiresAuthMiddleware,
    fieldsController.createField
  );

router
  .route('/:id/fields/:fieldId')
  .patch(
    schemaValidatorMiddleware(UPDATE_FIELD_SCHEMA),
    requiresAuthMiddleware,
    fieldsController.updateField
  )
  .delete(requiresAuthMiddleware, fieldsController.deleteField);

// Submission routes
router
  .route('/:id/submissions')
  .get(requiresAuthMiddleware, submissionsController.listSubmissions)
  .post(requiresAuthMiddleware, submissionsController.createSubmission);

export default router;
