# 🚀 Autonomous AI Creator & X Publisher

> **Autonomous Tech News Curator & Social Media Publisher** powered by **Google Gemini 2.5 Flash**, **TypeScript**, **Express**, and **Vercel Serverless Functions**.

![Live Control Dashboard](public/index.html)

---

## 🌟 Key Features

- 📰 **Autonomous Content Discovery**: Scrapes top developer stories from **HackerNews API** and curated **Tech RSS feeds** (TechCrunch, Ars Technica, The Verge).
- 🧠 **Gemini 2.5 Flash Quality Gate**: Multi-stage LLM pipeline that filters tech news, curates high-impact topics, drafts viral posts/threads, and performs automated self-critiques.
- 💬 **Vibrant Emojis & Visual Cards**: Generates punchy, formatted posts with expressive emojis and high-resolution tech cover banners.
- 🐦 **Multi-Tier X (Twitter) Publishing**:
  - **Direct API v2 / v1.1**: Automates direct tweeting if developer credentials are active.
  - **1-Click Intent Share**: Generates a 1-click `https://x.com/intent/post` share link when on Free/Pay-per-use X tiers—100% free with zero character limits!
- 🎨 **Glassmorphic Control Center**: Live responsive dark-mode dashboard displaying real-time agent persona settings, system status badges, and generated post cards.
- ⏱️ **Vercel Cron Automation**: Runs automatically once daily on Vercel's Free Hobby plan (`0 9 * * *`).

---

## 🛠️ Project Structure

```text
AI_CREATOR/
├── api/
│   └── index.ts            # Vercel Serverless Function entry point
├── public/
│   └── index.html          # Glassmorphic Control Panel Dashboard
├── src/
│   ├── agent/
│   │   ├── discovery.ts    # News scraper (HackerNews API & RSS Feeds)
│   │   └── pipeline.ts     # Gemini 2.5 Flash curation & quality gate
│   ├── db/
│   │   └── database.ts     # SQLite / Turso / Serverless Pure-JS DB Driver
│   ├── publishers/
│   │   └── twitter.ts      # X (Twitter) API v2 / v1.1 & Intent URL publisher
│   ├── routes/
│   │   └── api.ts          # Express REST API endpoints
│   ├── app.ts              # Express application initializer
│   └── index.ts            # Local development server entry point
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
2. Go to **[vercel.com/new](https://vercel.com/new)** and import your repository.
3. Under **Project Settings -> Environment Variables**, add:
   - `GEMINI_API_KEY`
   - `TWITTER_API_KEY`
   - `TWITTER_API_SECRET`
   - `TWITTER_ACCESS_TOKEN`
   - `TWITTER_ACCESS_SECRET`
   - `CRON_SECRET`
4. Click **Deploy**!

---

## 📄 License & Verification

This project was **100% Vibe-Coded** using Antigravity AI and Google Gemini.
For the complete prompt trajectory and verification transcript, see **[`PROMPTS.md`](PROMPTS.md)**.
