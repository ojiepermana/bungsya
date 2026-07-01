import { Elysia } from 'elysia';
import { greetingQuery, greetingResponse } from './greeting.schema';
import { GreetingService } from './greeting.service';

/**
 * Greeting module. Mounted under `/api` in app.ts, so this exposes GET /api/hello.
 *
 * Full-stack demo of the layered flow: route validates and delegates ->
 * service holds the logic -> repository owns the data. The route contains no
 * business logic (see apps/backend/CLAUDE.md).
 */
export const greetingRoutes = new Elysia({ name: 'module/greeting' }).get(
  '/hello',
  ({ query }) => GreetingService.greet(query.name),
  {
    query: greetingQuery,
    response: greetingResponse,
  },
);
