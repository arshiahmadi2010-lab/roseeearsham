import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../functions/api/backup.js', import.meta.url), 'utf8');
const { onRequest } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const rows = new Map();
const env = { BACKUPS: {
  async get(key) { return rows.get(key) ?? null; },
  async put(key, value) { rows.set(key, value); }
} };
const request = (method, url, body) => new Request(url, {
  method,
  headers: body === undefined ? {} : { 'content-type': 'application/json' },
  body: body === undefined ? undefined : JSON.stringify(body)
});
const id = 'a'.repeat(64);
const payload = { id, iv: 'A'.repeat(16), data: 'A'.repeat(24), ts: Date.now() };

let response = await onRequest({ request: request('POST', 'https://planner.test/api/backup', payload), env });
assert.equal(response.status, 200, 'Valid encrypted backup is accepted');
assert.equal((await response.json()).ok, true);

response = await onRequest({ request: request('GET', 'https://planner.test/api/backup?id=' + id), env });
assert.equal(response.status, 200, 'Stored backup can be retrieved');
assert.deepEqual(await response.json(), payload);

response = await onRequest({ request: request('GET', 'https://planner.test/api/backup?id=bad'), env });
assert.equal(response.status, 400, 'Malformed backup id is rejected');

response = await onRequest({ request: request('GET', 'https://planner.test/api/backup?id=' + 'b'.repeat(64)), env });
assert.equal(response.status, 404, 'Unknown backup id returns not found');

response = await onRequest({ request: request('POST', 'https://planner.test/api/backup', { ...payload, iv: 'short' }), env });
assert.equal(response.status, 400, 'Invalid AES-GCM IV is rejected');

response = await onRequest({ request: request('POST', 'https://planner.test/api/backup', { ...payload, data: 'not base64!!' }), env });
assert.equal(response.status, 400, 'Malformed ciphertext is rejected');

response = await onRequest({ request: request('POST', 'https://planner.test/api/backup', { ...payload, ts: -1 }), env });
assert.equal(response.status, 400, 'Invalid backup timestamp is rejected');

response = await onRequest({ request: request('PUT', 'https://planner.test/api/backup', payload), env });
assert.equal(response.status, 405, 'Unsupported methods are rejected');

response = await onRequest({ request: request('GET', 'https://planner.test/api/backup?id=' + id), env: {} });
assert.equal(response.status, 503, 'Missing KV binding returns service unavailable');
const previewEnv = { ...env, PREVIEW_MODE: 'true' };
response = await onRequest({ request: request('GET', 'https://planner.test/api/backup?id=' + id), env: previewEnv });
assert.equal(response.status, 503, 'Preview cannot read the production backup namespace');
response = await onRequest({ request: request('POST', 'https://planner.test/api/backup', payload), env: previewEnv });
assert.equal(response.status, 503, 'Preview cannot write to the production backup namespace');
assert.equal(rows.size, 1, 'Preview requests do not modify stored backups');

response = await onRequest({ request: request('POST', 'https://planner.test/api/backup', { ...payload, data: 'A'.repeat(1800004) }), env });
assert.equal(response.status, 413, 'Oversized ciphertext is rejected');

console.log('Cloud backup API tests: 12 route checks passed');
