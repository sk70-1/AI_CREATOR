import app from './app';
import { initDatabase } from './db/database';

const PORT = process.env.PORT || 3000;

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Autonomous AI Creator running locally on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
  });
