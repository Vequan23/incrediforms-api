require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

import authenticationRoutes from '@/features/authentication/authentication.routes';
import formsRoutes from '@/features/forms/forms.routes';
import { errorHandler } from '@/src/lib/utils/apiError';

const LOCAL_FRONTEND_URL = 'http://localhost:3006';
const PROD_FRONTEND_URL = 'https://incrediforms.vercel.app/';

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? PROD_FRONTEND_URL : LOCAL_FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})
);

app.use(express.json());
app.use('/auth', authenticationRoutes);
app.use('/forms', formsRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`IncrediForms API listening on port ${port}`);
});
