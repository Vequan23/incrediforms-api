require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
import { Request, Response, NextFunction } from 'express';

import authenticationRoutes from '@/features/authentication/authentication.routes';
import formsRoutes from '@/features/forms/forms.routes';
import aiRoutes from '@/features/ai/ai.routes'
import { errorHandler } from '@/src/lib/utils/apiError';
import figCollectionsRoutes from './features/fig-collections/figCollections.routes';

const PROD_FRONTEND_URL = 'https://www.incrediforms.com';

if (process.env.NODE_ENV === 'production') {
  app.use(cors({
    origin: PROD_FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
} else {
  // Development environment - disable CORS completely
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
    return;
  });
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));

// Regular routes with CORS
app.use('/auth', authenticationRoutes);
app.use('/forms', formsRoutes);
app.use('/fig-collections', figCollectionsRoutes);

// PUBLIC API ROUTE without CORS
app.use('/ai', (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
  return;
}, aiRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`IncrediForms API listening on port ${port}`);
});
