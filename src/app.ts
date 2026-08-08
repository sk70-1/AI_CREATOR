import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';
import { initDatabase } from './db/database';

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());

// Safe DB initialization middleware — catches promise rejections
app.use((req, res, next) => {
  initDatabase()
    .then(() => next())
    .catch((err) => {
      console.error('Non-fatal DB init error in serverless handler:', err);
      next();
    });
});

// Register API routes
app.use('/api', apiRouter);

// Global error handler for API
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled Express Error:', err);
  res.status(500).json({ success: false, error: err?.message || 'Internal Server Error' });
});

export default app;
