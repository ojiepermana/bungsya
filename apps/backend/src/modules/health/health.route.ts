import { Elysia } from 'elysia';
import { healthResponse } from './health.schema';
import { HealthService } from './health.service';

/**
 * Health module. Mounted under `/api` in app.ts, so this exposes GET /api/health.
 *
 * A lightweight module: route + schema + service, no repository — not every
 * module needs all four layers (see apps/backend/CLAUDE.md).
 */
export const healthRoutes = new Elysia({ name: 'module/health' }).get(
  '/health',
  () => HealthService.check(),
  { response: healthResponse },
);
