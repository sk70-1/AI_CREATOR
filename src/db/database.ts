import { createClient, Client } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.TURSO_DATABASE_URL || 'file:local.db';
const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

export const db: Client = createClient({
  url,
  authToken,
});

export async function initDatabase(): Promise<void> {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        domain TEXT NOT NULL,
        tone TEXT NOT NULL,
        mode TEXT DEFAULT 'autonomous',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        agent_id TEXT NOT NULL,
        content TEXT NOT NULL,
        rationale TEXT,
        topic_title TEXT,
        topic_url TEXT,
        tweet_id TEXT,
        tweet_url TEXT,
        status TEXT DEFAULT 'published',
        engagement_score INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS topic_history (
        id TEXT PRIMARY KEY,
        agent_id TEXT NOT NULL,
        topic_hash TEXT UNIQUE NOT NULL,
        topic_summary TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure default agent exists
    const existingAgent = await db.execute({
      sql: 'SELECT id FROM agents WHERE id = ?',
      args: ['default_agent'],
    });

    if (existingAgent.rows.length === 0) {
      await db.execute({
        sql: `INSERT INTO agents (id, name, domain, tone, mode) VALUES (?, ?, ?, ?, ?)`,
        args: [
          'default_agent',
          'Aura Tech & AI Strategist',
          'AI, Machine Learning, Web3, & Future Tech Trends',
          'Insightful, Authoritative, Sharp, & Thought-Provoking',
          'autonomous',
        ],
      });
    }
  } catch (error) {
    console.error('Error initializing Turso/SQLite Database:', error);
    throw error;
  }
}
