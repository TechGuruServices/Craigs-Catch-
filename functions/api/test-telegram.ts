interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ env }) => {
  const botToken = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return Response.json(
      { ok: false, message: "TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "✅ <b>CraigsCatch Telegram Test</b>\n\nYour Telegram notifications are working correctly! 🎉",
        parse_mode: "HTML",
      }),
    });

    const data = (await response.json()) as { ok: boolean; description?: string };

    if (data.ok) {
      return Response.json({ ok: true, message: "Test message sent successfully! Check your Telegram." });
    } else {
      return Response.json({ ok: false, message: data.description || "Telegram API returned an error." }, { status: 400 });
    }
  } catch (err: any) {
    return Response.json({ ok: false, message: `Request failed: ${err.message}` }, { status: 500 });
  }
};
