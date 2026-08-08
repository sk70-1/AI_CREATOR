import { createClient, Client } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

let clientInstance: Client | null = null;

export function getClient(): Client {
  if (clientInstance) return clientInstance;

  const url = process.env.TURSO_DATABASE_URL || 'file:local.db';
  const authToken = process.env.TURSO_AUTH_TOKEN;

  clientInstance = createClient({
    url,
    authToken: authToken || undefined,
  });

  console.log(`✅ LibSQL database client connected to: ${url}`);
  return clientInstance;
}

export const db = {
  execute: async (args: any) => {
    const client = getClient();
    return await client.execute(args);
  },
};

let isInitialized = false;

export async function initDatabase(): Promise<void> {
  if (isInitialized) return;

  const client = getClient();

  // Create tables if they do not exist
  await client.execute(`
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      domain TEXT NOT NULL,
      tone TEXT NOT NULL,
      mode TEXT NOT NULL DEFAULT 'autonomous',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
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
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS topic_history (
      id TEXT PRIMARY KEY,
      agent_id TEXT NOT NULL,
      topic_hash TEXT NOT NULL,
      topic_summary TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default agent if table is empty
  const existingAgent = await client.execute({
    sql: 'SELECT id FROM agents WHERE id = ?',
    args: ['default_agent'],
  });

  if (existingAgent.rows.length === 0) {
    await client.execute({
      sql: `INSERT INTO agents (id, name, domain, tone, mode, created_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        'default_agent',
        'Aura Tech & AI Strategist',
        'AI, Machine Learning, Web3, & Future Tech Trends',
        'Insightful, Authoritative, Sharp, & Thought-Provoking',
        'autonomous',
        new Date().toISOString(),
      ],
    });
    console.log('🌱 Seeded default agent configuration into database.');
  }

  isInitialized = true;
}

