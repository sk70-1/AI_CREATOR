import { Router, Request, Response } from 'express';
import { db, initDatabase } from '../db/database';
import { runAgentPipeline } from '../agent/pipeline';
import { publishToLinkedIn, getLinkedInShareIntentUrl } from '../publishers/linkedin';
import crypto from 'crypto';

const router = Router();

// Trigger manual run of the AI Creator pipeline with optional agentId
router.post('/agent/trigger', async (req: Request, res: Response) => {
  try {
    await initDatabase();
    const agentId = req.body?.agentId || req.query?.agentId as string;
    const result = await runAgentPipeline(agentId);
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

// Publish post to LinkedIn API or generate Intent URL
router.post('/agent/publish/linkedin', async (req: Request, res: Response) => {
  try {
    const { content, topicUrl, topicTitle } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, error: 'Post content is required.' });
    }

    const result = await publishToLinkedIn(content, topicUrl, topicTitle);
    res.json({ success: true, result });
  } catch (error: any) {
    console.error('Error publishing to LinkedIn:', error);
    res.status(500).json({ success: false, error: error.message || 'LinkedIn publish failed' });
  }
});

// Fetch all personas
router.get('/agent/personas', async (req: Request, res: Response) => {
  try {
    await initDatabase();
    const agentsResult = await db.execute('SELECT * FROM agents ORDER BY created_at ASC');
    res.json({ success: true, personas: agentsResult.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new persona
router.post('/agent/personas', async (req: Request, res: Response) => {
  try {
    await initDatabase();
    const { name, domain, tone, mode } = req.body;
    if (!name || !domain || !tone) {
      return res.status(400).json({ success: false, error: 'Name, domain, and tone are required.' });
    }

    const id = `persona_${crypto.randomBytes(4).toString('hex')}`;
    
    // Check if any existing persona is active; if none, make this active
    const activeCheck = await db.execute('SELECT id FROM agents WHERE is_active = 1');
    const isActive = activeCheck.rows.length === 0 ? 1 : 0;

    await db.execute({
      sql: `INSERT INTO agents (id, name, domain, tone, mode, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [id, name, domain, tone, mode || 'autonomous', isActive, new Date().toISOString()],
    });

    res.json({ success: true, message: 'Persona created successfully.', personaId: id });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update an existing persona
router.put('/agent/personas/:id', async (req: Request, res: Response) => {
  try {
    await initDatabase();
    const { id } = req.params;
    const { name, domain, tone, mode } = req.body;

    await db.execute({
      sql: `UPDATE agents SET name = ?, domain = ?, tone = ?, mode = ? WHERE id = ?`,
      args: [name, domain, tone, mode || 'autonomous', id],
    });

    res.json({ success: true, message: 'Persona updated successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Set a persona as active
router.post('/agent/personas/:id/select', async (req: Request, res: Response) => {
  try {
    await initDatabase();
    const { id } = req.params;

    // Deactivate all
    await db.execute('UPDATE agents SET is_active = 0');
    // Activate target
    await db.execute({
      sql: 'UPDATE agents SET is_active = 1 WHERE id = ?',
      args: [id],
    });

    res.json({ success: true, message: 'Active persona set successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a persona
router.delete('/agent/personas/:id', async (req: Request, res: Response) => {
  try {
    await initDatabase();
    const { id } = req.params;

    const countResult = await db.execute('SELECT COUNT(*) as count FROM agents');
    const count = Number(countResult.rows[0]?.count || 0);

    if (count <= 1) {
      return res.status(400).json({ success: false, error: 'Cannot delete the only remaining persona.' });
    }

    const agentResult = await db.execute({
      sql: 'SELECT is_active FROM agents WHERE id = ?',
      args: [id],
    });

    const wasActive = Number(agentResult.rows[0]?.is_active) === 1;

    await db.execute({
      sql: 'DELETE FROM agents WHERE id = ?',
      args: [id],
    });

    // If deleted persona was active, set another one active
    if (wasActive) {
      const remaining = await db.execute('SELECT id FROM agents LIMIT 1');
      if (remaining.rows[0]?.id) {
        await db.execute({
          sql: 'UPDATE agents SET is_active = 1 WHERE id = ?',
          args: [remaining.rows[0].id],
        });
      }
    }

    res.json({ success: true, message: 'Persona deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// System status endpoint
router.get('/agent/status', async (req: Request, res: Response) => {
  try {
    await initDatabase();
    const agentsResult = await db.execute('SELECT * FROM agents ORDER BY created_at ASC');
    const activeAgentResult = await db.execute('SELECT * FROM agents WHERE is_active = 1 LIMIT 1');
    const postsCountResult = await db.execute('SELECT COUNT(*) as count FROM posts');

    const agents = agentsResult.rows;
    const activeAgent = activeAgentResult.rows[0] || agents[0] || null;
    const postsCount = Number(postsCountResult.rows[0]?.count || 0);

    const hasTwitterKeys = Boolean(
      process.env.TWITTER_API_KEY &&
      process.env.TWITTER_API_SECRET &&
      process.env.TWITTER_ACCESS_TOKEN &&
      process.env.TWITTER_ACCESS_SECRET
    );

    const hasLinkedInKeys = Boolean(
      process.env.LINKEDIN_ACCESS_TOKEN &&
      process.env.LINKEDIN_AUTHOR_URN
    );

    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);

    res.json({
      success: true,
      agent: activeAgent,
      agents,
      postsCount,
      hasTwitterKeys,
      hasLinkedInKeys,
      hasGeminiKey,
      tursoConnected: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update agent persona configuration (legacy/active update)
router.post('/agent/config', async (req: Request, res: Response) => {
  try {
    await initDatabase();
    const { id, name, domain, tone, mode } = req.body;

    if (id) {
      await db.execute({
        sql: `UPDATE agents SET name = ?, domain = ?, tone = ?, mode = ? WHERE id = ?`,
        args: [name, domain, tone, mode || 'autonomous', id],
      });
    } else {
      await db.execute({
        sql: `UPDATE agents SET name = ?, domain = ?, tone = ?, mode = ? WHERE is_active = 1`,
        args: [name, domain, tone, mode || 'autonomous'],
      });
    }

    res.json({ success: true, message: 'Agent configuration updated successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cron trigger endpoint (called by Vercel Cron daily)
router.get('/cron/trigger', async (req: Request, res: Response) => {
  try {
    await initDatabase();
    const result = await runAgentPipeline();
    res.json({ success: true, result });
  } catch (error: any) {
    console.error('Cron trigger error:', error);
    res.status(500).json({ success: false, error: error.message || 'Cron pipeline failure' });
  }
});

export default router;
