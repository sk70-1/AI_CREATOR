import express from 'express';
import path from 'path';
import fs from 'fs';
import app from './app';
import { initDatabase } from './db/database';

const PORT = process.env.PORT || 3000;

// Local static file serving for local development
const staticDir = fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'))
  ? path.join(process.cwd(), 'dist')
  : path.join(process.cwd(), 'public');

app.use(express.static(staticDir));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const indexPath = path.join(staticDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    next();
  }
});

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Autonomous AI Creator running locally on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
  });
