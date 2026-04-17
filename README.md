<div align="center">

# 🌌 CraigsCatch
<h3>The Ultimate Craigslist Deal & Freebie Scanner</h3>

*A high-performance, self-hosted web application that monitors Craigslist search results for free items, extracts images, and sends real-time rich-media Telegram alerts.*

[Features](#-premium-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Telegram Setup](#-telegram-alerts-setup) • [AI Configuration](#-craigscatch-ai) • [Troubleshooting](#-troubleshooting)

</div>

---

## ✨ Premium Features

- 🚀 **Real-Time Background Monitoring** — An automated background polling engine that fetches the latest listings based on your customizable intervals.
- 📸 **Smart Image Extraction** — Automatically navigates through listings to scrape and attach full-resolution Craigslist pictures straight to your dashboard and Telegram alerts.
- 💬 **CraigsCatch AI (Powered by Ollama)** — Ask questions about your recent finds, evaluate deals, and get intelligent summaries locally using fast models like Llama 3 or Qwen.
- 📱 **PWA "Glassmorphic" Interface** — A meticulously crafted, mobile-first design system featuring deep gradients, smooth framer-motion micro-animations, layout transitions, and an app-like bottom navigation dock.
- 📨 **Rich-Media Telegram Alerts** — Instant push notifications delivering photo carousels and direct links for newly discovered listings straight to your devices.
- 🗄️ **Embedded Local Storage** — Lightning-fast, zero-config SQLite persistence leveraging Drizzle ORM.

---

## 🛠️ Tech Stack

Built with a modern, high-performance toolchain focusing on developer experience and pure speed:

| Category | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite |
| **Design System** | Tailwind CSS, Framer Motion, shadcn/ui |
| **Backend Service** | Node.js, Express |
| **Database & ORM** | SQLite (`better-sqlite3`), Drizzle ORM |
| **AI Inference** | Ollama (Local LLM) |
| **Integrations** | Telegram Bot API (Rich Media / Albums) |

---

## ⚡ Quick Start

### Prerequisites
- **Node.js 20+**
- (Optional) **Telegram Bot Token** and Chat ID (for receiving alerts)
- (Optional) **Ollama** installed on your system (for CraigsCatch AI chat features)

### 1️⃣ Installation

Clone the repository and install the heavily optimized dependency tree:

```bash
git clone https://github.com/TechGuruServices/Craigs-Catch-.git
cd Craigs-Catch-
npm install
```

### 2️⃣ Environment Configuration

Create a local environment file and fill in your details.

```bash
cp .env.example .env
```

**Essential Variables:**
```env
# Server
PORT=5000
CHECK_INTERVAL_MINUTES=10

# Database
DATABASE_URL=./local.db

# AI Chat (Local Ollama)
OLLAMA_URL=http://localhost:11434/api/chat
OLLAMA_MODEL=llama3

# Telegram Alerts (See Setup Guide Below)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=-100xxxxxxxxxx
```

### 3️⃣ Initialize Database
Push the schema to your local SQLite instance:
```bash
npm run db:push
```

### 4️⃣ Fire It Up
Launch the full-stack environment using our custom development server runner:
```bash
npm run dev
```

The premium dashboard will now be accessible at [http://localhost:5000](http://localhost:5000) 🚀

---

## 📨 Telegram Alerts Setup
CraigsCatch supports beautiful HTML-formatted messages alongside multi-image carousels.

1. **Create the Bot:** Open Telegram and message [@BotFather](https://t.me/botfather). Send `/newbot`, follow the prompts, and copy the **Bot Token**.
2. **Setup a Hub (Group):**
   - Create a Telegram super-group and add your newly minted bot.
   - Promote your bot to **Admin** (allowing it to post media to the chat).
   - Send a generic test message into the group.
3. **Capture the Chat ID:**
   Run the following cURL command to intercept your group's Chat ID:
   ```bash
   curl -s "https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates" | grep -o '"id":[-0-9]\+' | head -1
   ```
   > **Note:** Super-group IDs typically begin with `-100`.
4. **Test the Pipeline:**
   Trigger the pre-flight testing mechanism to ensure media routes are functioning correctly:
   ```bash
   curl -X POST http://localhost:5000/api/test-telegram
   ```

---

## 🧠 CraigsCatch AI (Ollama Setup)
Experience completely private, cost-free AI evaluations against your scraped listings.

1. Download and install [Ollama](https://ollama.ai/) for your operating system.
2. Open your terminal and pull a model of your choice: `ollama run llama3` (or `qwen`, `mistral`, etc.)
3. Ensure your `.env` contains the correct endpoint: `OLLAMA_URL=http://localhost:11434/api/chat`
4. *(Optional)* Select a specific model by setting `OLLAMA_MODEL` (default is `llama3`). 
5. Start chatting instantly in the **Ask AI** tab inside the dashboard.

---

## 🛡️ Troubleshooting

<details>
<summary><strong>📱 No Telegram Notifications Arriving?</strong></summary>

- Validate your `TELEGRAM_BOT_TOKEN` in `.env`.
- Ensure the Chat ID starts with `-100` if you're broadcasting to a group.
- Did you give your Bot **Admin Rights** in the group? It needs this to push images and run `sendMediaGroup`.
</details>

<details>
<summary><strong>🏗️ Application Failing to Boot? (Address In Use)</strong></summary>

- If you receive `EADDRINUSE`, the default port `5000` is tied up. Update your `PORT` variable inside `.env` to `5001` or another open port.
</details>

<details>
<summary><strong>🖼️ Scraped Listings Missing Images?</strong></summary>

- Craigslist sometimes blocks heavy scraping and automated bots. The engine attempts to bypass basic blocks using browser-mimicking user-agents, occasionally falling back if it's aggressively rate-limited by your local IP.
</details>

---

<div align="center">
  <p>Built with ❤️ by Tech Guru Services.</p>
  <i>"Don't search for it; let the deals come to you."</i>
</div>
