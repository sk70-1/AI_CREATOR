import { Router, Request, Response } from 'express';
import { db, initDatabase } from '../db/database';
import { runAgentPipeline } from '../agent/pipeline';

const router = Router();

// Trigger manual run of the AI Creator pipeline
router.post('/agent/trigger', async (req: Request, res: Response) => {
  try {
    await initDatabase();
    const result = await runAgentPipeline('default_agent');
    res.json({ success: true, result });
  } catch (error: any) {
    console.error('Error triggering agent pipeline:', error);
    res.status(500).json({ success: false, error: error.message || 'Pipeline failure' });
  }
});

// Fetch published posts feed
router.get('/agent/feed', async (req: Request, res: Response) => {
  try {
    await initDatabase();
    const postsResult = await db.execute('SELECT * FROM posts ORDER BY created_at DESC LIMIT 50');
    res.json({ success: true, posts: postsResult.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// System status endpoint
router.get('/agent/status', async (req: Request, res: Response) => {
  try {
    await initDatabase();
    const agentResult = await db.execute("SELECT * FROM agents WHERE id = 'default_agent'");
    const postsCountResult = await db.execute('SELECT COUNT(*) as count FROM posts');

    const agent = agentResult.rows[0] || null;
    const postsCount = Number(postsCountResult.rows[0]?.count || 0);

    const hasTwitterKeys = Boolean(
      process.env.TWITTER_API_KEY &&
      process.env.TWITTER_API_SECRET &&
      process.env.TWITTER_ACCESS_TOKEN &&
      process.env.TWITTER_ACCESS_SECRET
    );

    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);

    res.json({
      success: true,
      agent,
      postsCount,
      hasTwitterKeys,
      hasGeminiKey,
      tursoConnected: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update agent persona configuration
router.post('/agent/config', async (req: Request, res: Response) => {
  try {
    await initDatabase();
    const { name, domain, tone, mode } = req.body;

    await db.execute({
      sql: `UPDATE agents SET name = ?, domain = ?, tone = ?, mode = ? WHERE id = 'default_agent'`,
      args: [name, domain, tone, mode || 'autonomous'],
    });

    res.json({ success: true, message: 'Agent configuration updated successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cron trigger endpoint (called by Vercel Cron daily)
router.get('/cron/trigger', async (req: Request, res: Response) => {
  try {
    await initDatabase();
    const result = await runAgentPipeline('default_agent');
    res.json({ success: true, result });
  } catch (error: any) {
    console.error('Cron trigger error:', error);
    res.status(500).json({ success: false, error: error.message || 'Cron pipeline failure' });
  }
});

export default router;
