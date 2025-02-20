import express from 'express';

import { schemaValidatorMiddleware } from '@/middleware/schemaValidatorMiddleware';

import authenticationController from './authentication.controller';
import { CREDENTIALS_SCHEMA } from './authentication.schemas';
import { requiresAuthMiddleware } from '@/src/lib/middleware/requiresAuthMiddleware';

const router = express.Router();

router.post('/register', schemaValidatorMiddleware(CREDENTIALS_SCHEMA), authenticationController.register);
router.post('/login', schemaValidatorMiddleware(CREDENTIALS_SCHEMA), authenticationController.login);
// used for zapier integration
router.get('/me', authenticationController.getUserByApiKey);
router.get('/user', requiresAuthMiddleware, authenticationController.getUserById);

export default router;
