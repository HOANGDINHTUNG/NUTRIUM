import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './auth/auth.routes.js';
import { requireAuth } from './auth/auth.middleware.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Allow the frontend to call the API and exchange cookies for the refresh flow
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
}));

app.use('/api/auth', authRoutes);

// Example protected resource so the frontend can validate JWT handling
app.get('/api/foods', requireAuth, (req, res) => {
  res.json([{ id: 1, name: 'Chicken Breast' }]);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
