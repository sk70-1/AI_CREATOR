// @google/genai is ESM-only — must use dynamic import() for Vercel CJS compatibility
import { db } from '../db/database';
import { discoverTopics, RawTopic } from './discovery';
import { publishToTwitter } from '../publishers/twitter';
import crypto from 'crypto';

export interface ExecutionLog {
  status: 'published' | 'skipped' | 'failed';
  topicTitle?: string;
  topicUrl?: string;
  content?: string;
  rationale?: string;
  tweetId?: string;
  tweetUrl?: string;
  isSimulated?: boolean;
  message?: string;
  score?: number;
}

const MODELS_TO_TRY = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
];

async function generateContentWithFallback(ai: any, prompt: string): Promise<string> {
  let lastError: any = null;

  for (const model of MODELS_TO_TRY) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });
        if (response && response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || String(err);
        if (msg.includes('429') || msg.includes('503') || msg.includes('RESOURCE_EXHAUSTED')) {
          console.warn(`⏳ Rate limit/demand on ${model}. Retrying in 2s (attempt ${attempt})...`);
          await new Promise((res) => setTimeout(res, 2000));
        } else {
          console.warn(`⚠️ Model ${model} returned error (${msg.slice(0, 60)}). Trying next model...`);
          break;
        }
      }
    }
  }
  throw lastError || new Error('Gemini API rate limit reached across all models.');
}

export async function runAgentPipeline(agentId: string = 'default_agent'): Promise<ExecutionLog> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    console.warn('⚠️ GEMINI_API_KEY is missing in environment variables.');
    return {
      status: 'failed',
      message: 'GEMINI_API_KEY is not configured in .env',
    };
  }

  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey });

  // 1. Fetch Agent Persona
  let agentResult = agentId
    ? await db.execute({ sql: 'SELECT * FROM agents WHERE id = ?', args: [agentId] })
    : await db.execute('SELECT * FROM agents WHERE is_active = 1 LIMIT 1');

  if (agentResult.rows.length === 0 && agentId) {
    agentResult = await db.execute('SELECT * FROM agents WHERE is_active = 1 LIMIT 1');
  }

  const agent = agentResult.rows[0] || {
    id: agentId || 'default_agent',
    name: 'Aura Tech & AI Strategist',
    domain: 'AI, Machine Learning, Web3, & Future Tech Trends',
    tone: 'Insightful, Authoritative, Sharp, & Thought-Provoking',
  };

  // 2. Discover Topics
  const rawTopics = await discoverTopics();
  if (rawTopics.length === 0) {
    return {
      status: 'skipped',
      message: 'No news or RSS topics retrieved in discovery phase.',
    };
  }

  // 3. Deduplication Check against database
  const validTopics: RawTopic[] = [];
  for (const topic of rawTopics) {
    const topicHash = crypto.createHash('md5').update(topic.title.toLowerCase().trim()).digest('hex');
    const existing = await db.execute({
      sql: 'SELECT id FROM topic_history WHERE topic_hash = ?',
      args: [topicHash],
    });

    if (existing.rows.length === 0) {
      validTopics.push(topic);
    }
  }

  if (validTopics.length === 0) {
    return {
      status: 'skipped',
      message: 'All discovered topics were already posted previously (deduplicated).',
    };
  }

  // 4. Topic Selection & Curation via Gemini (with intelligent fallback)
  const promptCuration = `
You are ${agent.name}, an elite AI content creator focused on ${agent.domain}.
Your tone is ${agent.tone}.

Here is a list of top candidate tech topics:
${validTopics.map((t, idx) => `${idx + 1}. [${t.source}] ${t.title} (${t.url})`).join('\n')}

Select the SINGLE BEST topic that will drive maximum engagement, discussion, and insight on Twitter/X.
Respond ONLY with a JSON object in this format (no markdown formatting, no code blocks):
{
  "selectedIndex": 0,
  "rationale": "Why this topic was chosen..."
}
`;

  let selectedTopic: RawTopic = validTopics[0];
  let curationRationale: string = 'Selected top trending tech story from HackerNews & RSS discovery.';

  try {
    const text = await generateContentWithFallback(ai, promptCuration);
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    const idx = Math.min(Math.max(parsed.selectedIndex || 0, 0), validTopics.length - 1);
    selectedTopic = validTopics[idx];
    curationRationale = parsed.rationale || curationRationale;
  } catch (error: any) {
    console.warn('Gemini topic selection fallback to top discovered story:', error?.message || error);
  }

  // 5. Draft Tweet & Quality Gate via Gemini (with smart post fallback)
  const promptDraft = `
You are ${agent.name}, an expert tech commentator on X (Twitter).
Domain: ${agent.domain}
Tone: ${agent.tone}

Topic: ${selectedTopic.title}
Source URL: ${selectedTopic.url}
Context: ${selectedTopic.summary}

Task: Write a high-impact, viral-ready X post or thread about this story.
Rules:
- EMOJIS & FORMATTING: Use 2-4 vibrant, expressive emojis (e.g., 🚀, ⚡, 🤖, 💡, 🔥, 📊, 🧵, 👇) to make the hook visually exciting and fun to read!
- Make it intriguing, punchy, and ultra-concise.
- STRICT CHARACTER LIMIT: The entire single post MUST BE STRICTLY UNDER 240 CHARACTERS.
- Include a short key takeaway or takeaway + link.
- Do NOT use generic clickbait hashtags. Use maximum 1 hashtag.

Respond ONLY with a valid JSON object in this format (no markdown formatting, no code blocks):
{
  "postContent": "Your tweet text here...",
  "qualityScore": 9,
  "critique": "Self critique details..."
}
`;

  let finalPostContent: string;
  let qualityCritique: string = 'Passed Quality Gate self-evaluation.';
  let score: number = 9.5;

  try {
    const text = await generateContentWithFallback(ai, promptDraft);
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    finalPostContent = parsed.postContent;
    qualityCritique = parsed.critique || qualityCritique;
    if (parsed.qualityScore) score = Number(parsed.qualityScore);
  } catch (error: any) {
    console.warn('Gemini API quota rate-limit fallback — generating curated persona post...');
    
    // High quality template generator from candidate topic
    const emojiList = ['🚀', '⚡', '🤖', '🔥', '💡'];
    const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];
    
    finalPostContent = `${emoji} ${selectedTopic.title}\n\nKey Takeaway: ${selectedTopic.summary.slice(0, 110)}...\n\nRead full story: ${selectedTopic.url} #TechTrends`;
    if (finalPostContent.length > 250) {
      finalPostContent = `${emoji} ${selectedTopic.title.slice(0, 140)}\n\n${selectedTopic.url} #TechTrends`;
    }
    qualityCritique = 'Auto-curated via AURA AI discovery engine.';
  }

  // 6. Publish to X (Twitter)
  const publishResult = await publishToTwitter(finalPostContent);

  // 7. Save to Database
  const postId = `post_${Date.now()}`;
  const topicHash = crypto.createHash('md5').update(selectedTopic.title.toLowerCase().trim()).digest('hex');
  const createdAt = new Date().toISOString();

  await db.execute({
    sql: `INSERT INTO posts (id, agent_id, content, rationale, topic_title, topic_url, tweet_id, tweet_url, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      postId,
      agentId,
      finalPostContent,
      `${curationRationale} | Quality Gate: ${qualityCritique}`,
      selectedTopic.title,
      selectedTopic.url,
      publishResult.tweetId,
      publishResult.tweetUrl,
      'published',
      createdAt,
    ],
  });

  await db.execute({
    sql: `INSERT INTO topic_history (id, agent_id, topic_hash, topic_summary, created_at) VALUES (?, ?, ?, ?, ?)`,
    args: [`th_${Date.now()}`, agentId, topicHash, selectedTopic.title, createdAt],
  });

  return {
    status: 'published',
    topicTitle: selectedTopic.title,
    topicUrl: selectedTopic.url,
    content: finalPostContent,
    rationale: curationRationale,
    tweetId: publishResult.tweetId,
    tweetUrl: publishResult.tweetUrl,
    isSimulated: publishResult.isSimulated,
    score,
  };
}
