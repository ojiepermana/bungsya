import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import { join, resolve } from 'node:path';

/**
 * Root of the built static site (Eleventy output + the Angular app under /app).
 * Defaults to dist/website relative to the cwd; override with PUBLIC_DIR.
 */
const PUBLIC = process.env.PUBLIC_DIR
  ? resolve(process.env.PUBLIC_DIR)
  : join(process.cwd(), 'dist/website');

const PORT = Number(process.env.PORT ?? 3000);

const app = new Elysia()
  // --- API ---------------------------------------------------------------
  .group('/api', (api) =>
    api
      .get('/health', () => ({ status: 'ok' }))
      .get('/hello', () => ({ message: 'Hello from Elysia 👋' })),
  )

  // --- Static site (Eleventy + Angular) ----------------------------------
  // Explicit homepage so "/" always resolves cleanly.
  .get('/', () => Bun.file(join(PUBLIC, 'index.html')))
  // Serve every real file in dist/website (CSS, JS, images, /app/* assets, …).
  .use(staticPlugin({ assets: PUBLIC, prefix: '', indexHTML: true }))

  // --- Fallbacks ---------------------------------------------------------
  .onError(({ code, path, set }) => {
    if (code !== 'NOT_FOUND') return; // defer non-404s to default handling

    // Unknown API route -> JSON 404.
    if (path.startsWith('/api')) {
      set.status = 404;
      return { error: 'Not found' };
    }

    // Angular SPA deep links (e.g. /app/settings) -> serve the app shell.
    if (path === '/app' || path.startsWith('/app/')) {
      set.status = 200;
      return Bun.file(join(PUBLIC, 'app/index.html'));
    }

    set.status = 404;
    return new Response('Not found', { status: 404 });
  })
  .listen(PORT);

console.log(`🦊 Elysia serving ${PUBLIC} on http://localhost:${PORT}`);

export type App = typeof app;
