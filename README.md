# 🚀 Autonomous AI Creator — Aura AI Command Center

> **Autonomous Tech News Curator & X Publisher** powered by **Stitch MCP**, **Google Gemini 2.5 Flash**, **Turso Cloud LibSQL**, **Express**, and **Vercel Serverless Functions**.

---

## 🌟 Features

- 📰 **Content Discovery**: Scrapes top tech news from HackerNews API & curated RSS feeds.
- 🧠 **Gemini 2.5 Quality Gate**: AI topic curation, viral copy drafting, and automated quality scoring (9.6/10).
- 🎨 **Stitch MCP "Aura AI" Dashboard (5 Views)**:
  - 📊 **Command Center**: Real-time stats, animated pipeline, and filterable story feed.
  - 🧠 **Agent Personas**: Live persona editor with quick tone presets (`#Authoritative`, `#Technical`, `#Builder`).
  - ⚡ **Logic Pipeline**: 4-stage workflow visualizer (Discovery ➔ Deduplication ➔ Gemini Gate ➔ X Publish).
  - 📟 **Execution Logs**: Live streaming terminal execution console.
  - ⚙️ **System Settings**: Real-time API key & database status monitor.
- ☁️ **Turso Cloud DB**: Cloud LibSQL database persistence for serverless Lambdas and local dev.
- 🐦 **X (Twitter) Auto-Publisher**: Direct API publishing with 1-click Web Intent fallback.
- ⏱️ **Vercel Cron Automation**: Scheduled daily curation pipeline (`0 9 * * *`).

---

## 🛠️ Project Structure

```text
AI_CREATOR/
├── api/
│   └── index.ts            # Vercel Serverless entrypoint
├── public/
│   └── index.html          # Stitch MCP Aura AI Command Center Dashboard
├── src/
│   ├── agent/
│   │   ├── discovery.ts    # News scraper (HackerNews & RSS)
│   │   └── pipeline.ts     # Gemini 2.5 Flash curation & quality gate
│   ├── db/
│   │   └── database.ts     # Turso Cloud LibSQL Database Client
│   ├── publishers/
│   │   └── twitter.ts      # X (Twitter) Publisher
│   ├── routes/
│   │   └── api.ts          # Express API routes
│   └── app.ts              # Express application initializer
├── scratch/
│   └── view_db.ts          # Terminal DB inspector (`npm run db:view`)
├── vercel.json             # Vercel serverless & cron configuration
└── package.json            # NPM scripts & dependencies
```

---

## ⚡ Quick Start

### 1. Installation
```bash
git clone https://github.com/sk70-1/AI_CREATOR.git
cd AI_CREATOR
npm install
```

### 2. Environment Setup
Create a `.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your_turso_auth_token

TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_SECRET=your_twitter_access_secret
```

### 3. Run Locally
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🌐 Vercel Deployment

Deploy directly via Vercel CLI:
```bash
npx vercel --prod
```
Add `GEMINI_API_KEY`, `TURSO_DATABASE_URL`, and `TURSO_AUTH_TOKEN` under Vercel Project Settings.
