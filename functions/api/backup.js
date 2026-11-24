export async function onRequest({ request, env }) {
  const headers = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
  const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });
  if (!env.BACKUPS) return reply({ error: "Backup storage is not configured" }, 503);
  const url = new URL(request.url);
  if (request.method === "GET") {
    const id = url.searchParams.get("id") || "";
    if (!/^[a-f0-9]{64}$/.test(id)) return reply({ error: "Invalid backup id" }, 400);
    const raw = await env.BACKUPS.get("backup:" + id);
    if (!raw) return reply({ error: "Backup not found" }, 404);
    return new Response(raw, { headers });
  }
  if (request.method === "POST") {
    let body;
    try { body = await request.json(); } catch { return reply({ error: "Invalid JSON" }, 400); }
    const { id, iv, data, ts } = body || {};
    if (!/^[a-f0-9]{64}$/.test(id || "") || typeof iv !== "string" || typeof data !== "string" || !Number.isFinite(ts)) {
      return reply({ error: "Invalid backup payload" }, 400);
    }
    if (iv.length > 64 || data.length > 1800000) return reply({ error: "Backup too large" }, 413);
    await env.BACKUPS.put("backup:" + id, JSON.stringify({ id, iv, data, ts }));
    return reply({ ok: true, ts });
  }
  return reply({ error: "Method not allowed" }, 405);
}
