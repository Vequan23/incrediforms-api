import { schemaValidatorMiddleware } from './../../lib/middleware/schemaValidatorMiddleware';
import express from 'express';
import { aiController } from './ai.controller';
import { CREATE_GENERATION_SCHEMA } from './ai.schema';
import { requiresApiKeyMiddleware } from '@/src/lib/middleware/requiresApiKeyMiddleware';

const router = express.Router();

router.route('/generate').post(schemaValidatorMiddleware(CREATE_GENERATION_SCHEMA), requiresApiKeyMiddleware, aiController.generate);

export default router;
