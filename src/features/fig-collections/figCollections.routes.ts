import { schemaValidatorMiddleware } from '../../lib/middleware/schemaValidatorMiddleware';
import express from 'express';
import { CREATE_FIG_COLLECTION_SCHEMA } from './figCollections.schema';
import { figCollectionsController } from './figCollections.controller';
import { requiresAuthMiddleware } from '@/src/lib/middleware/requiresAuthMiddleware';

const router = express.Router();

// base route = /fig-collections

router.route('/').post(schemaValidatorMiddleware(CREATE_FIG_COLLECTION_SCHEMA), requiresAuthMiddleware, figCollectionsController.create);
router.route('/').get(requiresAuthMiddleware, figCollectionsController.list);

router.route('/:id').delete(requiresAuthMiddleware, figCollectionsController.delete);
router.route('/:id').patch(requiresAuthMiddleware, figCollectionsController.update);

router.route('/:id/files').post(requiresAuthMiddleware, figCollectionsController.createFile);
router.route('/:id/files/:fileId').delete(requiresAuthMiddleware, figCollectionsController.deleteFile);

export default router;

