import dotenv from 'dotenv';

dotenv.config();

// In-Memory Database for Vercel Serverless (zero native dependencies)
const memoryDb = {
  agents: [
    {
      id: 'default_agent',
      name: 'Aura Tech & AI Strategist',
      domain: 'AI, Machine Learning, Web3, & Future Tech Trends',
      tone: 'Insightful, Authoritative, Sharp, & Thought-Provoking',
      mode: 'autonomous',
      created_at: new Date().toISOString(),
    },
  ],
  posts: [] as any[],
  topic_history: [] as any[],
};

function createMemoryDriver() {
  return {
    execute: async (input: any) => {
      const sql = typeof input === 'string' ? input : input.sql;
      const args = typeof input === 'string' ? [] : input.args || [];
      const lowerSql = sql.toLowerCase().trim();

      if (lowerSql.startsWith('create table')) return { rows: [] };

      if (lowerSql.includes('from agents where id =')) {
        const id = args[0] || 'default_agent';
        const agent = memoryDb.agents.find((a) => a.id === id);
        return { rows: agent ? [agent] : [] };
      }
      if (lowerSql.includes('select * from agents')) return { rows: memoryDb.agents };
      if (lowerSql.includes('update agents')) {
        const [name, domain, tone, mode] = args;
        memoryDb.agents[0] = { ...memoryDb.agents[0], name, domain, tone, mode };
        return { rows: [] };
      }
      if (lowerSql.includes('select count(*)')) return { rows: [{ count: memoryDb.posts.length }] };
      if (lowerSql.includes('select * from posts')) return { rows: [...memoryDb.posts].reverse() };
      if (lowerSql.includes('insert into posts')) {
        const [id, agent_id, content, rationale, topic_title, topic_url, tweet_id, tweet_url, status] = args;
        memoryDb.posts.push({
          id, agent_id, content, rationale, topic_title, topic_url, tweet_id, tweet_url,
          status: status || 'published', engagement_score: 0, created_at: new Date().toISOString(),
        });
        return { rows: [] };
      }
      if (lowerSql.includes('select id from topic_history where topic_hash =')) {
        const hash = args[0];
        const existing = memoryDb.topic_history.find((t) => t.topic_hash === hash);
        return { rows: existing ? [existing] : [] };
      }
      if (lowerSql.includes('insert into topic_history')) {
        const [id, agent_id, topic_hash, topic_summary] = args;
        memoryDb.topic_history.push({ id, agent_id, topic_hash, topic_summary, created_at: new Date().toISOString() });
        return { rows: [] };
      }
      return { rows: [] };
    },
  };
}

let dbInstance: any = null;

async function resolveClient(): Promise<any> {
  if (dbInstance) return dbInstance;

  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // 1. Try Turso Cloud DB (works everywhere including Vercel)
  if (tursoUrl && (tursoUrl.startsWith('libsql://') || tursoUrl.startsWith('https://'))) {
    try {
      const { createClient } = await import('@libsql/client');
      dbInstance = createClient({ url: tursoUrl, authToken });
      console.log('✅ Connected to Turso Cloud DB');
      return dbInstance;
    } catch (e) {
      console.warn('⚠️ Turso Cloud DB connection failed:', e);
    }
  }

  // 2. Try local SQLite file (only works locally, not on Vercel)
  if (!process.env.VERCEL) {
    try {
      const { createClient } = await import('@libsql/client');
      dbInstance = createClient({ url: 'file:local.db' });
      console.log('✅ Connected to local SQLite DB');
      return dbInstance;
    } catch (e) {
      console.warn('⚠️ Local SQLite unavailable:', e);
    }
  }

  // 3. Fallback: Pure JS in-memory driver (always works on Vercel)
  console.log('ℹ️ Using in-memory database driver (Vercel serverless mode)');
  dbInstance = createMemoryDriver();
  return dbInstance;
}

// Proxy object that lazily resolves the real client on first use
export const db = {
  execute: async (args: any) => {
    const client = await resolveClient();
    return client.execute(args);
  },
};

export async function initDatabase(): Promise<void> {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, domain TEXT NOT NULL,
        tone TEXT NOT NULL, mode TEXT DEFAULT 'autonomous',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY, agent_id TEXT NOT NULL, content TEXT NOT NULL,
        rationale TEXT, topic_title TEXT, topic_url TEXT, tweet_id TEXT, tweet_url TEXT,
        status TEXT DEFAULT 'published', engagement_score INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS topic_history (
        id TEXT PRIMARY KEY, agent_id TEXT NOT NULL,
        topic_hash TEXT UNIQUE NOT NULL, topic_summary TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (error) {
    console.error('DB init error (non-fatal):', error);
  }
}
