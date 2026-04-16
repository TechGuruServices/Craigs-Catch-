# CraigsCatch — Craigslist Free Item Scanner

A self-hosted web app (PWA) that monitors Craigslist search results for free items and sends real-time Telegram alerts.

## Features

- 🔍 **Craigslist monitoring** — Track Craigslist search results automatically
- 📨 **Telegram alerts** — Instant notifications for new free items
- 🤖 **AI assistant** — Optional Ollama-powered chat for summaries and insights
- 📱 **PWA experience** — Installable on desktop and mobile
- 🗄️ **Local storage** — SQLite persistence via Drizzle ORM

---

## Local Development

### Prerequisites

- Node.js 20+
- (Optional) [Ollama](https://ollama.ai) for the AI chat feature
- (Optional) Telegram bot token and chat ID for notifications

### Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/TechGuruServices/daylume-main.git
   cd Craigslist-Item-Scanner-main
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Copy the example environment file**

   ```bash
   cp .env.example .env
   ```

4. **Edit `.env`**
   - `DATABASE_URL=./local.db`
   - `PORT=5000` (or another port if needed)
   - `CHECK_INTERVAL_MINUTES=10`
   - `OLLAMA_URL` and `OLLAMA_MODEL` if using AI chat
   - `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` if using alerts

5. **Push the database schema**

   ```bash
   npm run db:push
   ```

6. **Start the app**

   ```bash
   npm run dev
   ```

7. **Open the app**
   - [http://localhost:5000](http://localhost:5000)

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | ✅ Yes | `./local.db` | SQLite database file path |
| `PORT` | No | `5000` | Server port |
| `CHECK_INTERVAL_MINUTES` | No | `15` | Poll interval in minutes |
| `OLLAMA_URL` | No | `http://localhost:11434/api/generate` | Ollama API endpoint |
| `OLLAMA_MODEL` | No | `qwen` | Ollama model name |
| `TELEGRAM_BOT_TOKEN` | No | — | Telegram bot token from [@BotFather](https://t.me/botfather) |
| `TELEGRAM_CHAT_ID` | No | — | Telegram chat or group ID for alerts |

> Note: `.env` is excluded from git, so your secrets stay local.

---

## Telegram Alerts Setup

### 1. Create a Telegram bot

1. Open Telegram and message [@BotFather](https://t.me/botfather)
2. Send `/newbot`
3. Follow the prompts and copy the bot token

### 2. Get your Telegram chat ID

- For private notifications, message [@userinfobot](https://t.me/userinfobot)
- Use the returned user ID as `TELEGRAM_CHAT_ID`

### 3. Use a Telegram group for both users

1. Create a Telegram group or supergroup
2. Add your friend to the group
3. Add your bot to the group
4. Make the bot an admin so it can post messages
5. Send a message in the group to generate activity
6. Retrieve the group chat ID with the Bot API:

   ```bash
   curl -s "https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates" | grep -o '"id":[-0-9]\+' | head -1
   ```

7. Set `TELEGRAM_CHAT_ID` to the group ID, like `-1001234567890`

### 4. Test Telegram notifications

- Use the built-in test route:

  ```bash
  curl -X POST http://localhost:5000/api/test-telegram
  ```

- Or trigger a manual feed check:

  ```bash
  curl -X POST http://localhost:5000/api/jobs/check
  ```

---

## Troubleshooting

- **No Telegram messages?**
  - Confirm `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set correctly in `.env`.
  - Make sure the bot is started in Telegram by sending it a message.
  - If using a group, ensure the bot is added to the group and has permission to send messages.

- **Bot returns 401 Unauthorized**
  - The token is invalid or was copied incorrectly.
  - Regenerate the token with [@BotFather](https://t.me/botfather) and update `.env`.

- **Messages appear in private chat but not group**
  - Check that the group ID begins with `-100` for a supergroup.
  - Ensure the bot is a member and admin in the group.
  - Use `getUpdates` only after sending a message in the group to populate the ID.

- **App does not start / address in use**
  - Change `PORT` in `.env` to an unused port (for example, `5001`).
  - Restart the app after updating `.env`.

---

## How It Works

1. Add a Craigslist search URL from your target region
2. The app polls the URL every `CHECK_INTERVAL_MINUTES`
3. New items are parsed and deduplicated
4. Alerts are sent to Telegram for each new listing
5. The dashboard displays discovered items and monitors

---

## Notes

- The app currently uses **SQLite** for local storage.
- If you want both you and a friend to receive alerts, use a **Telegram group** chat ID.
- Do not commit your `.env` file or bot token to source control.

---

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, shadcn/ui
- **Backend**: Express, Node.js
- **Database**: SQLite + Drizzle ORM
- **AI**: Optional Ollama integration
- **Notifications**: Telegram Bot API
