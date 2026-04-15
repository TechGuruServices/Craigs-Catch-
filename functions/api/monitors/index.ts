interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const monitors = await env.DB.prepare(
    `SELECT * FROM monitors ORDER BY id DESC`
  ).all();
  return Response.json(monitors.results);
};

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const body = await request.json() as { name?: string; url?: string; active?: boolean };

    if (!body.name || !body.url) {
      return Response.json({ message: "name and url are required" }, { status: 400 });
    }

    await env.DB.prepare(
      `INSERT INTO monitors (name, url, active) VALUES (?, ?, ?)`
    ).bind(body.name, body.url, body.active !== false ? 1 : 0).run();

    const monitor = await env.DB.prepare(
      `SELECT * FROM monitors WHERE id = last_insert_rowid()`
    ).first();

    return Response.json(monitor, { status: 201 });
  } catch (err: any) {
    return Response.json({ message: err.message || "Internal server error" }, { status: 500 });
  }
};
