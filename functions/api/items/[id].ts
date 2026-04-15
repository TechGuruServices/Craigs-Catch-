interface Env {
  DB: D1Database;
}

export const onRequestDelete: PagesFunction<Env> = async ({ env, params }) => {
  await env.DB.prepare(`DELETE FROM items WHERE id = ?`).bind(Number(params.id)).run();
  return new Response(null, { status: 204 });
};
