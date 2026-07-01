# Bungkit

A single-`package.json` starterkit that combines two apps on the **Bun** runtime,
with a CSS-first **TailwindCSS v4** theme:

| App | Stack | Source | Build output |
| --- | --- | --- | --- |
| Frontend SPA | [Angular 22](https://angular.dev/) (zoneless, standalone) | `apps/app` | `dist/public` |
| Backend API | [ElysiaJS](https://elysiajs.com/) | `apps/backend` | `dist/backend` |

In **production** a single Elysia/Bun process serves everything from one origin:

```text
http://localhost:3000/         -> Angular SPA (deep links fall back to the app shell)
http://localhost:3000/api/*    -> Elysia API
```

## Requirements

- [Bun](https://bun.com) `>= 1.3`

## Install

```bash
bun install
cp .env.example .env   # one shared .env feeds both apps
```

## Environment

A single root `.env` (template: `.env.example`) configures **both** apps — Bun
auto-loads it for every `bun` command.

- **Backend (Elysia)** reads it directly (`apps/backend/src/config/env.ts`).
- **Frontend (Angular)** can't read `.env` in the browser, so
  [`scripts/generate-env.ts`](scripts/generate-env.ts) bakes the public vars into
  `apps/app/src/environments/environment.ts` (generated, git-ignored) before
  `dev:app` / `build:app`.

| Scope | Visibility | Example |
| --- | --- | --- |
| Allowlisted in `PUBLIC_KEYS` ([scripts/generate-env.ts](scripts/generate-env.ts)) | **Public** — compiled into the browser bundle (never secrets) | `API_URL` → `environment.apiUrl` |
| Everything else | **Server-only** — Elysia | `API_PORT`, `PUBLIC_DIR` |

> The API port is **`API_PORT`, not `PORT`**: `ng serve` overrides its own port
> from `PORT`, so a shared bare `PORT` would collide with the API.

## Develop

Runs both apps concurrently, each with hot reload (HMR):

```bash
bun run dev
```

- Angular app → <http://localhost:4200> — `ng serve` HMR (proxies `/api` → Elysia via `proxy.conf.json`)
- Elysia API → <http://localhost:3000> — `bun --hot` hot-swaps modules without a full restart

You can also run either app on its own: `bun run dev:app`, `bun run dev:api`.

## Build & run (production)

```bash
bun run build        # builds app -> backend into dist/
bun run start        # one Bun process serves the app and the API
```

Then open <http://localhost:3000>.

Override the served directory or API port with `PUBLIC_DIR` / `API_PORT` (in `.env`
or the environment).

## How the pieces fit

- **Tailwind v4** is configured CSS-first. The app owns its design tokens
  (`@theme { … }`, e.g. `brand-*` / `font-display`) and compiles CSS through
  Angular's PostCSS pipeline via [`.postcssrc.json`](.postcssrc.json)
  (`@tailwindcss/postcss`). Tokens live in
  [`apps/app/src/theme.css`](apps/app/src/theme.css), imported by
  [`apps/app/src/styles.css`](apps/app/src/styles.css).
- **Angular output** is flattened straight into `dist/public` (no `browser/`
  subfolder) using `outputPath: { base, browser: "" }` and the default `/`
  baseHref. See [`angular.json`](angular.json).
- **Elysia** serves the static tree with `@elysiajs/static` and adds an `onError`
  fallback so Angular client-side routes (e.g. `/about`) return the app shell.
  That lives in the SPA plugin
  [`apps/backend/src/shared/plugins/static-spa.plugin.ts`](apps/backend/src/shared/plugins/static-spa.plugin.ts);
  the server is assembled in [`apps/backend/src/app.ts`](apps/backend/src/app.ts)
  and booted from [`apps/backend/src/main.ts`](apps/backend/src/main.ts).
- **Backend structure** follows a layered route → service → repository convention.
  See [`apps/backend/CLAUDE.md`](apps/backend/CLAUDE.md) (rules) and
  [`docs/backend-structure.md`](docs/backend-structure.md) (rationale).

## Scripts

| Script | Description |
| --- | --- |
| `dev` | Run app + API together (live reload) |
| `test` | Run backend tests (`bun test apps/backend`) |
| `env:generate` | Regenerate the Angular env from root `.env` (auto-runs before dev:app/build:app) |
| `build` | Clean, then build both into `dist/` |
| `start` | Run the built Elysia server (serves everything) |
| `clean` | Remove `dist/` and the Angular cache |
| `build:app` / `build:backend` | Per-app builds |

## Layout

```text
apps/
  app/        # Angular 22: standalone, zoneless, own theme.css, HttpClient -> /api
  backend/    # ElysiaJS: layered modules (route -> service -> repository)
    src/
      main.ts app.ts   # entry point + assembly
      config/          # env (typed)
      shared/          # errors, types, reusable plugins (static-spa, …)
      modules/         # health, greeting  (demo modules)
      tests/           # bun tests
    CLAUDE.md          # backend structure rules
docs/          # folder-structure guidelines (backend + frontend)
scripts/       # generate-env.ts (root .env -> Angular environment.ts)
.env .env.example   # shared config for both apps
angular.json  proxy.conf.json  .postcssrc.json  tsconfig.json
```
