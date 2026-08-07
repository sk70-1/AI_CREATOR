import dotenv from 'dotenv';

dotenv.config();

// Pure JavaScript In-Memory Database — zero native dependencies, works everywhere
const memoryStore = {
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

function createPureJsDriver() {
  return {
    execute: async (input: any) => {
      const sql = typeof input === 'string' ? input : input.sql;
      const args = typeof input === 'string' ? [] : input.args || [];
      const lower = sql.toLowerCase().trim();

      if (lower.startsWith('create table')) return { rows: [] };

      if (lower.includes('from agents where id =')) {
        const id = args[0] || 'default_agent';
        return { rows: memoryStore.agents.filter((a) => a.id === id) };
      }
      if (lower.includes('select * from agents')) return { rows: memoryStore.agents };
      if (lower.includes('update agents')) {
        const [name, domain, tone, mode] = args;
        if (memoryStore.agents[0]) {
          memoryStore.agents[0] = { ...memoryStore.agents[0], name, domain, tone, mode };
        }
        return { rows: [] };
      }
      if (lower.includes('select count(*)')) return { rows: [{ count: memoryStore.posts.length }] };
      if (lower.includes('select * from posts')) return { rows: [...memoryStore.posts].reverse() };
      if (lower.includes('insert into posts')) {
        const [id, agent_id, content, rationale, topic_title, topic_url, tweet_id, tweet_url, status] = args;
        memoryStore.posts.push({
          id, agent_id, content, rationale, topic_title, topic_url, tweet_id, tweet_url,
          status: status || 'published', engagement_score: 0, created_at: new Date().toISOString(),
        });
        return { rows: [] };
      }
      if (lower.includes('from topic_history where topic_hash =')) {
        const hash = args[0];
        return { rows: memoryStore.topic_history.filter((t) => t.topic_hash === hash) };
      }
      if (lower.includes('insert into topic_history')) {
        const [id, agent_id, topic_hash, topic_summary] = args;
        memoryStore.topic_history.push({ id, agent_id, topic_hash, topic_summary, created_at: new Date().toISOString() });
        return { rows: [] };
      }
      return { rows: [] };
    },
  };
}

let _client: any = null;

function getClient(): any {
  if (_client) return _client;
  _client = createPureJsDriver();
  console.log('✅ Using pure JS in-memory database');
  return _client;
}

export const db = {
  execute: async (args: any) => getClient().execute(args),
};

export async function initDatabase(): Promise<void> {
  getClient();
}
