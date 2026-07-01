import { t } from 'elysia';

/** Response contract for GET /api/health. */
export const healthResponse = t.Object({
  status: t.String(),
});

export type HealthResponse = typeof healthResponse.static;
