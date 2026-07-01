# CLAUDE.md

Guidance for AI agents (and humans) working in this repo.

## What this is

**Bungkit** — a single-`package.json` starter kit running two apps on the **Bun**
runtime, served from one origin in production, with a CSS-first **TailwindCSS v4** theme.

| App | Stack | Source | Build output |
| --- | --- | --- | --- |
| Frontend SPA | Angular 22 (zoneless, standalone) | `apps/app` | `dist/public` |
| Backend API | ElysiaJS | `apps/backend` | `dist/backend` |

In production a single Elysia/Bun process serves everything:

```text
http://localhost:3000/          -> Angular SPA (deep links fall back to the app shell)
http://localhost:3000/api/*     -> Elysia API
```

In dev the two run separately: `ng serve` (4200) owns the SPA and proxies `/api`
to Elysia (3000) via [proxy.conf.json](proxy.conf.json).

## Commands

| Command | What it does |
| --- | --- |
| `bun install` | Install dependencies |
| `bun run dev` | Run app + API together with hot reload |
| `bun run dev:app` / `bun run dev:api` | Run just one side |
| `bun run env:generate` | Regenerate the Angular env from root `.env` (auto-runs before dev:app/build:app) |
| `bun run test` | Run backend tests (`bun test apps/backend`) |
| `bun run build` | Clean, then build app + backend into `dist/` |
| `bun run start` | Run the built server (`dist/backend/main.js`) — serves everything |
| `bun run clean` | Remove `dist/` and the Angular cache |

Runtime is **Bun** (`>= 1.3`), not Node. Prefer Bun APIs and `bun` scripts.

## Environment (`.env`)

A single root [.env](.env) feeds **both** apps (template: [.env.example](.env.example)).
Bun auto-loads it for every `bun` command.

- **Backend (Elysia)** reads it directly via
  [apps/backend/src/config/env.ts](apps/backend/src/config/env.ts) — the only
  place that touches `process.env`.
- **Frontend (Angular)** can't read `.env` in the browser, so
  [scripts/generate-env.ts](scripts/generate-env.ts) bakes the public vars into
  `apps/app/src/environments/environment.ts` (git-ignored, generated) before
  `dev:app`/`build:app`.

Conventions — **respect these when adding vars:**

- **Frontend vars are opt-in via an allowlist**: only keys listed in `PUBLIC_KEYS`
  in [scripts/generate-env.ts](scripts/generate-env.ts) are baked into the browser
  bundle. Add a key there to expose it — **never add a secret.** Referenced in code
  as camelCase (`API_URL` → `environment.apiUrl`).
- Any var **not** in that allowlist is **server-only** (Elysia). Never sent to the client.
- The API port is **`API_PORT`, not `PORT`** — `ng serve` hijacks its own port from
  `PORT`, so a bare `PORT` in `.env` would push the Angular dev-server onto the API port.

## Layout

```text
apps/
  app/        # Angular 22 SPA — standalone, zoneless, own theme.css, HttpClient -> /api
  backend/    # ElysiaJS API — layered structure; see apps/backend/CLAUDE.md
docs/         # Folder-structure guidelines (backend + frontend)
```

## Backend

The backend follows a strict layered structure (route → schema → service →
repository). **Before adding or changing anything under `apps/backend`, read
[apps/backend/CLAUDE.md](apps/backend/CLAUDE.md)** — it defines the directory
layout, dependency rules, naming, and how to add a module. The long-form
rationale lives in [docs/backend-structure.md](docs/backend-structure.md).

## Frontend

- Angular 22, **standalone** components, **zoneless** change detection. Use
  signals; no NgModules.
- API access goes through [apps/app/src/app/api.service.ts](apps/app/src/app/api.service.ts)
  using **relative** `/api/...` URLs (proxied in dev, same-origin in prod).
- Tailwind v4 is CSS-first. Design tokens live in
  [apps/app/src/theme.css](apps/app/src/theme.css); don't add a `tailwind.config.js`.
- The `angular-developer` skill has deep references for Angular patterns.

## Conventions

- TypeScript, strict mode (see [tsconfig.json](tsconfig.json)).
- Keep the frontend and backend decoupled: they communicate only over `/api`.
- Only commit or push when asked.
