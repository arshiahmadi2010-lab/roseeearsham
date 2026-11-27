export async function onRequest({ request, env }) {
  const headers = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
  const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });
  if (!env.BACKUPS) return reply({ error: "Backup storage is not configured" }, 503);
  const hostname = new URL(request.url).hostname.toLowerCase();
  const previewPagesHost = hostname.endsWith(".planner-arshia-test.pages.dev") && hostname !== "planner-arshia-test.pages.dev";
  if (env.PREVIEW_MODE === "true" || previewPagesHost) return reply({ error: "Cloud backup is disabled in preview deployments" }, 503);
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
    const validIv = typeof iv === "string" && /^[A-Za-z0-9+/]{16}$/.test(iv);
    const validData = typeof data === "string" && data.length >= 24 && data.length % 4 === 0 && /^[A-Za-z0-9+/]+={0,2}$/.test(data);
    if (!/^[a-f0-9]{64}$/.test(id || "") || !validIv || !validData || !Number.isSafeInteger(ts) || ts <= 0) {
      return reply({ error: "Invalid backup payload" }, 400);
    }
    if (data.length > 1800000) return reply({ error: "Backup too large" }, 413);
    await env.BACKUPS.put("backup:" + id, JSON.stringify({ id, iv, data, ts }));
    return reply({ ok: true, ts });
  }
  return reply({ error: "Method not allowed" }, 405);
}
