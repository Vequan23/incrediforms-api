require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

import authenticationRoutes from '@/features/authentication/authentication.routes';
import formsRoutes from '@/features/forms/forms.routes';
import { errorHandler } from '@/src/lib/utils/apiError';

app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/auth', authenticationRoutes);
app.use('/forms', formsRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`IncrediForms API listening on port ${port}`);
});
