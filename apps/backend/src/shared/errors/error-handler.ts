import { Elysia } from 'elysia';
import { AppError } from './app-error';

/**
 * Global API error handler. Applied once in app.ts; every error flows through here.
 *  - AppError subclasses      -> their `status` + a JSON `{ error, code }` body.
 *  - Elysia VALIDATION errors -> 422 JSON.
 *  - Unknown `/api/*` routes   -> 404 JSON.
 *
 * Non-API errors (e.g. an unknown page path) are returned untouched so the SPA
 * fallback in shared/plugins/static-spa.plugin.ts can serve the app shell.
 */
export const errorHandler = new Elysia({ name: 'shared/error-handler' }).onError(
  { as: 'global' },
  ({ code, error, path, set }) => {
    if (error instanceof AppError) {
      set.status = error.status;
      return { error: error.message, code: error.code };
    }

    if (code === 'VALIDATION') {
      set.status = 422;
      return { error: 'Validation failed', code: 'VALIDATION' };
    }

    if (code === 'NOT_FOUND' && path.startsWith('/api')) {
      set.status = 404;
      return { error: 'Not found', code: 'NOT_FOUND' };
    }

    // Not an API concern — let the next handler (SPA fallback) or Elysia decide.
    return;
  },
);
