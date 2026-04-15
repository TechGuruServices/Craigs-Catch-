interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const messages = await env.DB.prepare(
    `SELECT * FROM messages ORDER BY created_at ASC`
  ).all();
  return Response.json(messages.results);
};
