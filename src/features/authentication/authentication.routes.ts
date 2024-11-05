import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { schemaValidatorMiddleware } from '@/middleware/schemaValidatorMiddleware';
import { STATUS_CODES } from '@/constants/statusCodes.constants';

import { CREDENTIALS_SCHEMA } from './authentications.schemas';

const router = express.Router();

router.post('/register', schemaValidatorMiddleware(CREDENTIALS_SCHEMA), async (req, res) => {
  const { email, password } = req.body;

  res.status(STATUS_CODES.OK).json({ message: 'User registered successfully' });
});

router.post('/login', schemaValidatorMiddleware(CREDENTIALS_SCHEMA), async (req, res) => {
  const { email, password } = req.body;

  res.status(STATUS_CODES.OK).json({ message: 'User logged in successfully' });
});

export default router;
