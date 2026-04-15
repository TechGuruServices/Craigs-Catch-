interface Env {
  DB: D1Database;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ env }) => {
  try {
    await checkFeeds(env);
    return Response.json({ message: "Check completed successfully" });
  } catch (error: any) {
    return Response.json({ message: error.message || "Failed to check feeds" }, { status: 500 });
  }
};

export async function checkFeeds(env: Env) {
  const monitors = await env.DB.prepare(
    `SELECT * FROM monitors WHERE active = 1`
  ).all();

  for (const monitor of monitors.results as any[]) {
    try {
      const items = await scrapecraigslist(monitor.url);
      let newCount = 0;

      for (const item of items) {
        const existing = await env.DB.prepare(
          `SELECT id FROM items WHERE guid = ?`
        ).bind(item.guid).first();

        if (!existing) {
          await env.DB.prepare(
            `INSERT INTO items (monitor_id, title, link, description, posted_at, guid, created_at)
             VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
          ).bind(
            monitor.id,
            item.title,
            item.link,
            item.description,
            item.postedAt,
            item.guid
          ).run();

          newCount++;
          await sendTelegramAlert(env, item.title, item.link, monitor.name);
          await new Promise((r) => setTimeout(r, 250));
        }
      }

      await env.DB.prepare(
        `UPDATE monitors SET last_checked = datetime('now') WHERE id = ?`
      ).bind(monitor.id).run();

      console.log(`[scheduler] Monitor "${monitor.name}": ${newCount} new items`);
    } catch (err) {
      console.error(`[scheduler] Failed to check monitor "${monitor.name}":`, err);
    }
  }
}

async function scrapecraigslist(feedUrl: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const urlObj = new URL(feedUrl);
  urlObj.searchParams.delete("format");
  const htmlUrl = urlObj.toString();

  try {
    const response = await fetch(htmlUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok) throw new Error(`Status ${response.status}`);
    const html = await response.text();

    const items: { title: string; link: string; guid: string; description: string; postedAt: string }[] = [];
    const regex = /<li class="cl-static-search-result" title="([^"]+)"[\s\S]*?<a href="([^"]+)">/g;

    const decodeHtml = (s: string) =>
      s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
       .replace(/&quot;/g, '"').replace(/&#39;/g, "'");

    let match;
    while ((match = regex.exec(html)) !== null) {
      const title = decodeHtml(match[1]);
      const link = match[2];
      items.push({ title, link, guid: link, description: title, postedAt: new Date().toISOString() });
    }

    return items;
  } finally {
    clearTimeout(timeout);
  }
}

async function sendTelegramAlert(env: Env, title: string, link: string, monitorName: string) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;

  const safe = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const text = `🚨 <b>New Item Found!</b> 🚨\n\n<b>${safe(title)}</b>\n\n<a href="${link}">View on Craigslist</a>\n<i>Monitor: ${safe(monitorName)}</i>`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: "HTML" }),
        }
      );
      if (res.ok) return;
      if (res.status === 429) {
        const data = (await res.json()) as { parameters?: { retry_after?: number } };
        await new Promise((r) => setTimeout(r, (data.parameters?.retry_after || 5) * 1000));
      } else return;
    } catch {
      if (attempt < 3) await new Promise((r) => setTimeout(r, 500 * Math.pow(2, attempt - 1)));
    }
  }
}
