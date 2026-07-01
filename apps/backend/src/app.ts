import { Elysia } from 'elysia';
import { errorHandler } from './shared/errors/error-handler';
import { staticSpa } from './shared/plugins/static-spa.plugin';
import { healthRoutes } from './modules/health/health.route';
import { greetingRoutes } from './modules/greeting/greeting.route';

/**
 * Assembles the whole application. Order matters:
 *   plugins/error handler -> routes -> static SPA (fallback).
 *
 * No business logic, no SQL, no env reads live here — those belong to modules,
 * services, and config/ respectively (see apps/backend/CLAUDE.md).
 */
export const app = new Elysia()
  // Global error handling first, so every downstream error is shaped consistently.
  .use(errorHandler)
  // API modules, all under /api. Add new modules here.
  .group('/api', (api) => api.use(healthRoutes).use(greetingRoutes))
  // Static Angular SPA + client-side deep-link fallback (prod only).
  .use(staticSpa);

export type App = typeof app;
