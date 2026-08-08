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

// Safe async DB init middleware — catches rejected promises to prevent Lambda crashes
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

// Global error handler — catches all Express errors cleanly
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled Express Error:', err);
  res.status(500).json({ success: false, error: err?.message || 'Internal Server Error' });
});

export default app;
