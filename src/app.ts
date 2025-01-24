require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

import authenticationRoutes from '@/features/authentication/authentication.routes';
import formsRoutes from '@/features/forms/forms.routes';
import aiRoutes from '@/features/ai/ai.routes'
import { errorHandler } from '@/src/lib/utils/apiError';
import figCollectionsRoutes from './features/fig-collections/figCollections.routes';

const LOCAL_FRONTEND_URL = 'http://localhost:3006';
const PROD_FRONTEND_URL = 'https://www.incrediforms.com';

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? PROD_FRONTEND_URL : LOCAL_FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// PUBLIC API ROUTE
// RENAME TO fig-api soon
app.use('/ai', aiRoutes)

// Apply CORS to all routes by default
app.use(cors(corsOptions));


app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));

app.use('/auth', authenticationRoutes);
app.use('/forms', formsRoutes);
app.use('/fig-collections', figCollectionsRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`IncrediForms API listening on port ${port}`);
});
