import { join, resolve } from 'node:path';

/**
 * Typed, validated application environment.
 *
 * Rule (see apps/backend/CLAUDE.md): this is the ONLY place that reads
 * `process.env`. Everything else imports `env` from here. No business logic.
 */
function toPort(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error(`Invalid PORT "${value}" — expected an integer 0-65535`);
  }
  return port;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  // API_PORT is preferred; PORT is the fallback so PaaS platforms that inject
  // PORT still work. (`.env` avoids a bare PORT — it would hijack `ng serve`.)
  PORT: toPort(process.env.API_PORT ?? process.env.PORT, 3000),
  /** Root of the built Angular SPA (dist/public by default; override with PUBLIC_DIR). */
  PUBLIC_DIR: process.env.PUBLIC_DIR
    ? resolve(process.env.PUBLIC_DIR)
    : join(process.cwd(), 'dist/public'),
} as const;

export type Env = typeof env;
