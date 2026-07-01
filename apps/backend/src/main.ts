import { app } from './app';
import { env } from './config/env';
import { spaIsBuilt } from './shared/plugins/static-spa.plugin';

/**
 * Entry point: load env, start the HTTP server, wire graceful shutdown.
 * No routes, business logic, SQL, or validation here — that all lives in app.ts
 * and the modules (see apps/backend/CLAUDE.md).
 */
app.listen(env.PORT);

console.log(
  spaIsBuilt
    ? `🦊 Elysia serving ${env.PUBLIC_DIR} on http://localhost:${env.PORT}`
    : `🦊 Elysia API on http://localhost:${env.PORT} — no built SPA at ${env.PUBLIC_DIR} (run \`bun run build\` to serve it; \`ng serve\` handles the app in dev)`,
);

function shutdown(signal: string): void {
  console.log(`${signal} received — shutting down gracefully`);
  app.stop();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export type { App } from './app';
