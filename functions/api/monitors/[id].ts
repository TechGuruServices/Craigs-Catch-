interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const id = Number(params.id);
  const monitor = await env.DB.prepare(`SELECT * FROM monitors WHERE id = ?`).bind(id).first();
  if (!monitor) return Response.json({ message: "Monitor not found" }, { status: 404 });
  return Response.json(monitor);
};

export const onRequestPut: PagesFunction<Env> = async ({ env, params, request }) => {
  const id = Number(params.id);
  const monitor = await env.DB.prepare(`SELECT * FROM monitors WHERE id = ?`).bind(id).first();
  if (!monitor) return Response.json({ message: "Monitor not found" }, { status: 404 });

  const body = await request.json() as { name?: string; url?: string; active?: boolean; lastChecked?: string };

  const updates: string[] = [];
  const values: unknown[] = [];

  if (body.name !== undefined) { updates.push("name = ?"); values.push(body.name); }
  if (body.url !== undefined) { updates.push("url = ?"); values.push(body.url); }
  if (body.active !== undefined) { updates.push("active = ?"); values.push(body.active ? 1 : 0); }
  if (body.lastChecked !== undefined) { updates.push("last_checked = ?"); values.push(body.lastChecked); }

  if (updates.length === 0) return Response.json(monitor);

  values.push(id);
  await env.DB.prepare(`UPDATE monitors SET ${updates.join(", ")} WHERE id = ?`).bind(...values).run();

  const updated = await env.DB.prepare(`SELECT * FROM monitors WHERE id = ?`).bind(id).first();
  return Response.json(updated);
};

export const onRequestDelete: PagesFunction<Env> = async ({ env, params }) => {
  const id = Number(params.id);
  await env.DB.prepare(`DELETE FROM monitors WHERE id = ?`).bind(id).run();
  return new Response(null, { status: 204 });
};
