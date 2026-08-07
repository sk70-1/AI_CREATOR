import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import apiRouter from './routes/api';
import { initDatabase } from './db/database';

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());

// Lazy DB init for all requests
app.use(async (req, res, next) => {
  try {
    await initDatabase();
  } catch (error) {
    console.error('DB init error (non-fatal):', error);
  }
  next();
});

// Register API routes
app.use('/api', apiRouter);

// Serve static frontend dashboard
app.use(express.static(path.join(__dirname, '../public')));

// Fallback: serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Global error handler — prevents unhandled errors from crashing the Lambda
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled Express Error:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

export default app;
