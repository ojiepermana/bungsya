import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import { join, resolve } from 'node:path';

/**
 * Root of the built Angular SPA.
 * Defaults to dist/public relative to the cwd; override with PUBLIC_DIR.
 */
const PUBLIC = process.env.PUBLIC_DIR
  ? resolve(process.env.PUBLIC_DIR)
  : join(process.cwd(), 'dist/public');

const PORT = Number(process.env.PORT ?? 3000);

const app = new Elysia()
  // --- API ---------------------------------------------------------------
  .group('/api', (api) =>
    api
      .get('/health', () => ({ status: 'ok' }))
      .get('/hello', () => ({ message: 'Hello from Elysia 👋' })),
  )

  // --- Static site (Angular SPA) -----------------------------------------
  // Explicit homepage so "/" always resolves cleanly.
  .get('/', () => Bun.file(join(PUBLIC, 'index.html')))
  // Serve every real file in dist/public (CSS, JS, images, assets, …).
  .use(staticPlugin({ assets: PUBLIC, prefix: '', indexHTML: true }))

  // --- Fallbacks ---------------------------------------------------------
  .onError(({ code, path, set }) => {
    if (code !== 'NOT_FOUND') return; // defer non-404s to default handling

    // Unknown API route -> JSON 404.
    if (path.startsWith('/api')) {
      set.status = 404;
      return { error: 'Not found' };
    }

    // Angular SPA deep links (e.g. /about) -> serve the app shell.
    set.status = 200;
    return Bun.file(join(PUBLIC, 'index.html'));
  })
  .listen(PORT);

console.log(`🦊 Elysia serving ${PUBLIC} on http://localhost:${PORT}`);

export type App = typeof app;
