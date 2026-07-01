import { t } from 'elysia';

/** Query for GET /api/hello — optional `?name=` to personalise the greeting. */
export const greetingQuery = t.Object({
  name: t.Optional(t.String()),
});

/** Response contract for GET /api/hello. */
export const greetingResponse = t.Object({
  message: t.String(),
});

export type GreetingQuery = typeof greetingQuery.static;
export type GreetingResponse = typeof greetingResponse.static;
