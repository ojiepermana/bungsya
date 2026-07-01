import { describe, expect, it } from 'bun:test';
import { app } from '../app';

describe('health module', () => {
  it('GET /api/health -> { status: "ok" }', async () => {
    const res = await app.handle(new Request('http://localhost/api/health'));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'ok' });
  });
});
