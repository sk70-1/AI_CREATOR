# 🚀 Autonomous AI Creator & X Publisher — Aura AI Suite

> **Autonomous Tech News Curator & Social Media Publisher** powered by **Stitch MCP**, **Google Gemini 2.5 Flash**, **Turso Cloud LibSQL DB**, **TypeScript**, **Express**, and **Vercel Serverless Functions**.

---

## 🌟 Key Features

- 📰 **Autonomous Content Discovery**: Scrapes top developer stories from **HackerNews API** and curated **Tech RSS feeds** (TechCrunch, Ars Technica, The Verge).
- 🧠 **Gemini 2.5 Flash Quality Gate**: Multi-stage LLM pipeline that filters tech news, curates high-impact topics, drafts viral posts/threads, and performs automated self-critiques.
- 🎨 **Stitch MCP "Aura AI" Command Center Suite**:
  - 📊 **Command Center View**: Real-time stat cards (Total Posts, Topics Curated, Quality Score `9.6/10`, Next Cron Run), animated AI Curation Pipeline, and Live Published Feed with instant search & category filters.
  - 🧠 **Agent Personas View**: Active agent identity preview card, full persona configuration form, and quick tone presets (`#Authoritative`, `#Technical`, `#Builder`, `#Visionary`).
  - ⚡ **Logic Pipeline View**: Interactive 4-stage processing visualizer (Discovery ➔ Deduplication ➔ Gemini Gate ➔ X Publish).
  - 📟 **Execution Logs View**: Live streaming execution terminal with timestamps (`[SYS_INIT]`, `[TURSO_DB]`, `[GEMINI_GATE]`, `[X_PUBLISH]`) and Clear Console action.
  - ⚙️ **System Settings View**: Real-time integration status cards for Gemini API, X OAuth API, Turso Cloud DB, and Vercel Cron.
- ☁️ **Turso Cloud LibSQL Database**: High-performance cloud SQLite database persistence for serverless Lambdas and local development.
- 💬 **Formatted Posts & Banner Cards**: Generates punchy posts with 2-4 vibrant emojis, character counters (`240/280`), collapsible **AI Curation Rationale**, and cover banners.
- 🐦 **Multi-Tier X (Twitter) Publishing**:
  - **Direct API v2 / v1.1**: Automates direct tweeting if developer credentials are active.
  - **1-Click Intent Share**: Generates 1-click `https://x.com/intent/post` share links for non-premium accounts.
- ⏱️ **Vercel Cron Automation**: Runs automatically once daily on Vercel's Hobby plan (`0 9 * * *`).

---

## 🛠️ Project Structure

```text
AI_CREATOR/
├── api/
│   └── index.ts            # Vercel Serverless Function entry point
├── public/
│   └── index.html          # Stitch MCP Aura AI Command Center Suite (5 Views)
├── src/
│   ├── agent/
│   │   ├── discovery.ts    # News scraper (HackerNews API & RSS Feeds)
│   │   └── pipeline.ts     # Gemini 2.5 Flash curation & quality gate
│   ├── db/
│   │   └── database.ts     # Turso Cloud LibSQL Database Client (@libsql/client)
│   ├── publishers/
│   │   └── twitter.ts      # X (Twitter) API v2 / v1.1 & Intent URL publisher
│   ├── routes/
│   │   └── api.ts          # Express REST API endpoints
│   ├── app.ts              # Express application initializer
│   └── index.ts            # Local development server entry point
├── scratch/
│   └── view_db.ts          # Terminal DB inspector utility (`npm run db:view`)
├── .env                    # Local environment variables
├── PROMPTS.md              # AI-Usage log & vibe-coding transcript
├── vercel.json             # Vercel rewrites & cron configuration
└── package.json            # Dependencies & npm scripts
```

---

## ⚡ Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/sk70-1/AI_CREATOR.git
cd AI_CREATOR
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Google Gemini API Key (Get your free key from https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# Turso Cloud LibSQL Database Configuration
TURSO_DATABASE_URL=libsql://your-database-name.turso.io
TURSO_AUTH_TOKEN=your_turso_auth_token

# X (Twitter) API Credentials (Optional)
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_SECRET=your_twitter_access_secret

# Vercel Cron Security Secret
CRON_SECRET=my_super_secret_cron_token_123

PORT=3000
```

### 3. Launch Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

### 4. Inspect Database Tables
Inspect saved posts and topic history in your terminal anytime:
```bash
npm run db:view
```

---

## 🌐 Deploying Live to Vercel

1. Push your repository to GitHub (`sk70-1/AI_CREATOR`).
2. Go to **[vercel.com/new](https://vercel.com/new)** and import your repository (or run `npx vercel --prod`).
3. Under **Project Settings -> Environment Variables**, add:
   - `GEMINI_API_KEY`
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `TWITTER_API_KEY`
   - `TWITTER_API_SECRET`
   - `TWITTER_ACCESS_TOKEN`
   - `TWITTER_ACCESS_SECRET`
   - `CRON_SECRET`
4. Click **Deploy**!

---

## 📄 License & Verification

This project was **100% Vibe-Coded** using Antigravity AI, Google Gemini, and Stitch MCP.
For the complete prompt trajectory and verification transcript, see **[`PROMPTS.md`](PROMPTS.md)**.
