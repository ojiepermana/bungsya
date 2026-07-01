import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { env } from '../../config/env';

/**
 * Serves the built Angular SPA from PUBLIC_DIR and makes client-side deep links
 * (e.g. /about) fall back to the app shell.
 *
 * No-op until a production build exists: in dev, `ng serve` owns the SPA and
 * this backend is API-only (see README). Because it's a cross-cutting concern
 * — not business logic — it lives in shared/plugins, not a module.
 */
const indexHtml = join(env.PUBLIC_DIR, 'index.html');
const hasSite = existsSync(indexHtml);

export const staticSpa = new Elysia({ name: 'shared/static-spa' }).onError(
  { as: 'global' },
  ({ code, path, set }) => {
    if (code !== 'NOT_FOUND') return;
    if (path.startsWith('/api')) return; // handled by the API error handler

    if (hasSite) {
      set.status = 200;
      return Bun.file(indexHtml);
    }

    set.status = 404;
    return 'Not found';
  },
);

if (hasSite) {
  staticSpa
    // Explicit homepage so "/" always resolves cleanly.
    .get('/', () => Bun.file(indexHtml))
    // Serve every real file in PUBLIC_DIR (CSS, JS, images, assets, …).
    .use(staticPlugin({ assets: env.PUBLIC_DIR, prefix: '', indexHTML: true }));
}

export const spaIsBuilt = hasSite;
