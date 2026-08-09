# Creators :-<details>
  <summary><b>Souvik Konar</b></summary>
  <ul>
    <li><a href="https://linkedin.com/in/YOUR-LINKEDIN-USERNAME" target="_blank">LinkedIn Profile</a></li>
    <li><a href="https://github.com/YOUR-GITHUB-USERNAME" target="_blank">GitHub Profile</a></li>
  </ul>
</details>,<details>
  <summary><b>Soumalya Das</b></summary>
  <ul>
    <li><a href="https://linkedin.com/in/YOUR-LINKEDIN-USERNAME" target="_blank">LinkedIn Profile</a></li>
    <li><a href="https://github.com/YOUR-GITHUB-USERNAME" target="_blank">GitHub Profile</a></li>
  </ul>
</details>,<details>
  <summary><b>Satyabrata Das</b></summary>
  <ul>
    <li><a href="https://linkedin.com/in/YOUR-LINKEDIN-USERNAME" target="_blank">LinkedIn Profile</a></li>
    <li><a href="https://github.com/YOUR-GITHUB-USERNAME" target="_blank">GitHub Profile</a></li>
  </ul>
</details>
# 🚀 Autonomous AI Creator — AURA AI Command Center

> **Autonomous Tech News Curator & Multi-Platform Publisher** powered by **React**, **TypeScript**, **Tailwind CSS**, **Google Gemini 2.0 Flash**, **LinkedIn API**, **Turso Cloud DB**, and **Vercel Serverless Functions**.

---

## 🌟 Key Features

- 📰 **Autonomous Content Discovery**: Scrapes top tech news from HackerNews API & curated RSS feeds (TechCrunch, Ars Technica, The Verge).
- 🧠 **Gemini AI Quality Gate**: Automated story selection, persona tone adaptation, viral copy creation, and 9.5/10 quality scoring.
- 🎨 **Automated AI Topic Cover Art**: Generates high-resolution 3D neon obsidian topic cover graphics for every story.
- 💼 **Multi-Platform Auto-Publisher**:
  - **LinkedIn**: Direct API publishing via `ugcPosts` endpoint (with automatic member URN resolution) + 1-click share intent.
  - **X (Twitter)**: Direct OAuth API v2 posting + 1-click Web Intent.
  - **Reddit**: 1-click pre-filled link submission.
- 💻 **Stitch MCP UI (5 Command Views)**:
  - 📊 **Command Center**: Live metrics, pipeline trigger, and filterable multi-platform content stream.
  - 🤖 **Agent Personas**: Real-time persona manager & tone customizer.
  - ⚡ **Logic Pipeline**: 4-stage workflow visualizer (Discovery ➔ Deduplication ➔ Gemini Gate ➔ Multi-Publish).
  - 📟 **Execution Logs**: Real-time execution console.
  - ⚙️ **System Settings**: Multi-service API key & database status telemetry.
- ☁️ **Turso Cloud LibSQL DB**: Stateless HTTP database client for serverless functions and local dev.
- ⏱️ **Vercel Cron Automation**: Scheduled daily curation pipeline (`0 9 * * *`).

---

## 🛠️ Project Structure

```text
AI_CREATOR/
├── api/
│   └── index.ts            # Vercel Serverless Function entrypoint
├── src/
│   ├── agent/
│   │   ├── discovery.ts    # HackerNews & RSS scraper with request timeouts
│   │   └── pipeline.ts     # Gemini 2.0 Flash curation & AI image generator
│   ├── db/
│   │   └── database.ts     # Turso Cloud LibSQL HTTP Client
│   ├── publishers/
│   │   ├── linkedin.ts     # LinkedIn ugcPosts API & Intent publisher
│   │   └── twitter.ts      # X (Twitter) API & Intent publisher
│   ├── frontend/
│   │   ├── components/     # React dashboard components (Sidebar, Feed, Stats, etc.)
│   │   ├── App.tsx         # Main application controller
│   │   └── main.tsx        # React Vite root entry
│   ├── routes/
│   │   └── api.ts          # Express REST API routes
│   └── app.ts              # Express API server instance
├── vercel.json             # Vercel SPA rewrites & cron configuration
├── vite.config.ts          # Vite build configuration (outputs to dist/)
└── package.json            # Scripts & dependencies
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
Create a `.env` file in the root directory:
```env
# Gemini API Key (https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key

# Turso Cloud Database (https://turso.tech/)
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your_turso_auth_token

# LinkedIn OAuth Credentials (Optional)
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token
LINKEDIN_AUTHOR_URN=urn:li:person:your_member_id

# X (Twitter) Developer API Keys (Optional)
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

1. Connect your repository to **Vercel**.
2. Set **Framework Preset** to **Vite** and **Output Directory** to **`dist`**.
3. Add `GEMINI_API_KEY`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, and `LINKEDIN_ACCESS_TOKEN` under **Project Settings ➔ Environment Variables** (for **Production**).
