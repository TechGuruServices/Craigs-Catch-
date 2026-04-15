interface Env {
  DB: D1Database;
  GROQ_API_KEY: string;
  MODEL_NAME?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const body = await request.json() as { message: string };
    if (!body.message) {
      return Response.json({ message: "message is required" }, { status: 400 });
    }

    // Save user message
    await env.DB.prepare(
      `INSERT INTO messages (role, content, created_at) VALUES (?, ?, datetime('now'))`
    ).bind("user", body.message).run();

    // Call Groq AI
    let aiContent = "";
    try {
      const groqApiKey = env.GROQ_API_KEY;
      const model = env.MODEL_NAME || "llama3-8b-8192";

      if (!groqApiKey) throw new Error("GROQ_API_KEY is not configured.");

      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content:
                "You are CraigsCatch AI, a helpful assistant that helps users find and evaluate free items on Craigslist. Be concise, friendly, and practical.",
            },
            { role: "user", content: body.message },
          ],
          temperature: 0.7,
          max_tokens: 512,
        }),
      });

      if (groqResponse.ok) {
        const data = (await groqResponse.json()) as {
          choices: { message: { content: string } }[];
        };
        aiContent = data.choices?.[0]?.message?.content || "No response received.";
      } else {
        const errText = await groqResponse.text();
        throw new Error(`Groq API error ${groqResponse.status}: ${errText}`);
      }
    } catch (error) {
      console.error("Groq AI error:", error);
      aiContent = `⚠️ AI Error: ${error instanceof Error ? error.message : String(error)}`;
    }

    // Save assistant response
    await env.DB.prepare(
      `INSERT INTO messages (role, content, created_at) VALUES (?, ?, datetime('now'))`
    ).bind("assistant", aiContent).run();

    return Response.json({ response: aiContent });
  } catch (err: any) {
    return Response.json({ message: err.message || "Internal server error" }, { status: 500 });
  }
};
