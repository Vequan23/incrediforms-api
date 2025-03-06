import express from 'express';

// Middleware imports
import { schemaValidatorMiddleware } from '@/middleware/schemaValidatorMiddleware';
import { requiresAuthMiddleware } from '@/src/lib/middleware/requiresAuthMiddleware';

// Controller imports
import formsController from './forms.controller';
import fieldsController from './fields/fields.controller';
import submissionsController from './submissions/submissions.controller';
import scheduledReportsController from './scheduled-reports/scheduled-reports.controller';
// Schema imports
import { CREATE_FORM_SCHEMA, CREATE_PROMPT_FILE_SCHEMA, UPDATE_FORM_SCHEMA } from './forms.schemas';
import { CREATE_FIELD_SCHEMA, UPDATE_FIELD_SCHEMA, REORDER_FIELDS_SCHEMA } from './fields/fields.schemas';
import { CREATE_SCHEDULED_REPORT_SCHEMA } from './scheduled-reports/scheduled-reports.schema';
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
  .get(formsController.getPublishedForm)
  .post(requiresAuthMiddleware, formsController.publishForm);

router
  .route('/:id/prompt-file')
  .post(
    schemaValidatorMiddleware(CREATE_PROMPT_FILE_SCHEMA),
    requiresAuthMiddleware,
    formsController.createPromptFile
  );

router
  .route('/:id/prompt-file/:promptFileId')
  .delete(requiresAuthMiddleware, formsController.deletePromptFile);

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
  .route('/:id/fields/reorder')
  .patch(
    schemaValidatorMiddleware(REORDER_FIELDS_SCHEMA),
    requiresAuthMiddleware,
    fieldsController.reorderFields
  );

router
  .route('/:id/fields/:field_id')
  .patch(
    schemaValidatorMiddleware(UPDATE_FIELD_SCHEMA),
    requiresAuthMiddleware,
    fieldsController.updateField
  )
  .delete(requiresAuthMiddleware, fieldsController.deleteField);

router
  .route('/:id/fields/:field_id/options')
  .get(requiresAuthMiddleware, fieldsController.listFieldOptions);

// Submission routes
router
  .route('/:id/submissions')
  .get(requiresAuthMiddleware, submissionsController.listSubmissions)
  .post(submissionsController.createSubmission);


// Scheduled Report routes
router
  .route('/:id/scheduled-reports')
  .get(requiresAuthMiddleware, scheduledReportsController.getReportByFormId)
  .delete(requiresAuthMiddleware, scheduledReportsController.deleteScheduledReport)
  .post(
    schemaValidatorMiddleware(CREATE_SCHEDULED_REPORT_SCHEMA),
    requiresAuthMiddleware,
    scheduledReportsController.createScheduledReport
  );

// router
//   .route('/scheduled-reports/reset')
//   .post(scheduledReportsController.resetAllCronJobs);

export default router;
