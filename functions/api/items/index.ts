interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const url = new URL(request.url);
  const monitorId = url.searchParams.get("monitorId");

  let items;
  if (monitorId) {
    items = await env.DB.prepare(
      `SELECT * FROM items WHERE monitor_id = ? ORDER BY created_at DESC`
    ).bind(Number(monitorId)).all();
  } else {
    items = await env.DB.prepare(
      `SELECT * FROM items ORDER BY created_at DESC`
    ).all();
  }

  return Response.json(items.results);
};
