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

// Lazy DB & Env Initialization for all requests
app.use(async (req, res, next) => {
  dotenv.config();
  try {
    await initDatabase();
  } catch (error) {
    console.error('Lazy DB initialization error:', error);
  }
  next();
});

// Register API routes
app.use('/api', apiRouter);

// Serve static frontend dashboard
app.use(express.static(path.join(__dirname, '../public')));

export default app;
