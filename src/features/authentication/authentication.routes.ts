import express from 'express';

import { schemaValidatorMiddleware } from '@/middleware/schemaValidatorMiddleware';

import authenticationController from './authentication.controller';
import { CREDENTIALS_SCHEMA } from './authentication.schemas';

const router = express.Router();

router.post('/register', schemaValidatorMiddleware(CREDENTIALS_SCHEMA), authenticationController.register);
router.post('/login', schemaValidatorMiddleware(CREDENTIALS_SCHEMA), authenticationController.login);

export default router;
