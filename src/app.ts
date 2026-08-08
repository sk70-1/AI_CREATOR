import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
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

// Serve static frontend dashboard (dist or public fallback)
const staticDir = fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'))
  ? path.join(process.cwd(), 'dist')
  : path.join(process.cwd(), 'public');

app.use(express.static(staticDir));

// Fallback: serve index.html for SPA routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const indexPath = path.join(staticDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    next();
  }
});

// Global error handler — prevents unhandled errors from crashing the Lambda
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled Express Error:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

export default app;
