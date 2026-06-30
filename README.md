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
```

## Develop

Runs both apps concurrently with live reload:

```bash
bun run dev
```

- Angular app → <http://localhost:4200> (proxies `/api` → Elysia via `proxy.conf.json`)
- Elysia API → <http://localhost:3000>

You can also run either app on its own: `bun run dev:app`, `bun run dev:api`.

## Build & run (production)

```bash
bun run build        # builds app -> backend into dist/
bun run start        # one Bun process serves the app and the API
```

Then open <http://localhost:3000>.

Override the served directory or port with env vars: `PUBLIC_DIR`, `PORT`.

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
  See [`apps/backend/src/index.ts`](apps/backend/src/index.ts).

## Scripts

| Script | Description |
| --- | --- |
| `dev` | Run app + API together (live reload) |
| `build` | Clean, then build both into `dist/` |
| `start` | Run the built Elysia server (serves everything) |
| `clean` | Remove `dist/` and the Angular cache |
| `build:app` / `build:backend` | Per-app builds |

## Layout

```text
apps/
  app/        # Angular 22: standalone, zoneless, own theme.css, HttpClient -> /api
  backend/    # ElysiaJS: /api/* + static serving + SPA fallback
angular.json  proxy.conf.json  .postcssrc.json  tsconfig.json
```
