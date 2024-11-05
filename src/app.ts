require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

import authenticationRoutes from '@/features/authentication/authentication.routes';

app.use(express.json());
app.use('/auth', authenticationRoutes);

app.listen(port, () => {
  console.log(`IncrediForms API listening on port ${port}`);
});
