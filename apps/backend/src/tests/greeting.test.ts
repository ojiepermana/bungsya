import { describe, expect, it } from 'bun:test';
import { app } from '../app';

describe('greeting module', () => {
  it('GET /api/hello -> default greeting', async () => {
    const res = await app.handle(new Request('http://localhost/api/hello'));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: 'Hello from Elysia 👋' });
  });

  it('GET /api/hello?name=Ada -> personalised greeting', async () => {
    const res = await app.handle(
      new Request('http://localhost/api/hello?name=Ada'),
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: 'Hello, Ada! 👋' });
  });

  it('unknown /api route -> JSON 404', async () => {
    const res = await app.handle(new Request('http://localhost/api/nope'));

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'Not found', code: 'NOT_FOUND' });
  });
});
