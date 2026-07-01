# Backend structure rules (Bun + ElysiaJS)

These rules are **mandatory** for everything under `apps/backend`. They keep the
API modular, testable, and ORM-agnostic. Long-form rationale: [../../docs/backend-structure.md](../../docs/backend-structure.md).

The folders below that already exist are a **demo starter kit** — two modules
(`health`, `greeting`) that show the pattern. Do **not** scaffold empty example
folders; create a file/folder only when a real feature needs it.

## Directory layout

```text
src/
├── main.ts                  # entry point — env, listen, graceful shutdown. Nothing else.
├── app.ts                   # assembly — plugins → routes → static SPA → error handling.
├── config/                  # env & config only. NO business logic.
│   └── env.ts               # the ONLY place that reads process.env (from root .env; port = API_PORT)
├── shared/                  # reusable across modules. MUST NOT import from modules/.
│   ├── errors/              # AppError hierarchy + global error-handler plugin
│   ├── types/               # cross-module types (ApiResponse, Pagination, …)
│   ├── plugins/             # reusable Elysia plugins (static-spa, auth, logger, …)
│   └── utils/               # pure reusable helpers (add when needed)
├── modules/                 # one folder per bounded context (feature)
│   ├── health/              # lightweight module: route + schema + service
│   └── greeting/            # full module: route + schema + service + repository
├── database/                # client.ts, migrations/, seeds/ — add when a DB is introduced
├── jobs/                    # background work (cron, queues, workers) — add when needed
└── tests/                   # bun tests, mirror module names (health.test.ts, …)
```

## Layers & dependency flow

```text
HTTP → route → (schema validation) → service → repository → database
```

Each layer knows only the layer directly below it (one-way dependency).

| Layer | File | Does | Must NOT |
| --- | --- | --- | --- |
| **Route** | `*.route.ts` | receive request, validate via schema, call a service, return | SQL, business logic, calculations, calling a repository/DB |
| **Schema** | `*.schema.ts` | body/query/params/headers/response contracts (Elysia `t`) | call service or repository |
| **Service** | `*.service.ts` | ALL business logic, workflows, calls to repositories & other services | touch HTTP/`Context`, run raw SQL |
| **Repository** | `*.repository.ts` | data access only (SELECT/INSERT/UPDATE/DELETE, tx, raw SQL) | business rules, HTTP, validation, calling a service |

**Dependency rules:**

- Route → Service only. Route must not call Repository or the database.
- Service → Repository + shared.
- Repository → database only. Repository must not call a Service.
- Schema must not call Service or Repository.
- `shared/` must not depend on any module.
- Modules never import another module's **repository**; cross-module work goes
  through the other module's **service**.

## Naming

Lowercase **kebab-case**, dot-suffixed by role:
`customer.route.ts`, `customer.schema.ts`, `customer.service.ts`, `customer.repository.ts`.
Avoid `CustomerService.ts`, `myFile.ts`.

## Elysia idioms (see the `elysiajs` skill for depth)

- **1 Elysia instance = 1 controller.** Define routes on the instance; don't pass
  `Context` into a class. Export each module's routes as an Elysia instance
  (e.g. `export const greetingRoutes = new Elysia({ name: 'module/greeting' })…`).
- **Services are `abstract class` + `static` methods** (no instance allocation),
  decoupled from Elysia so they're trivial to unit-test.
- **Schemas use Elysia `t`**; derive types with `typeof schema.static`. Single
  source of truth for runtime validation and TypeScript types.
- **Errors:** services throw an `AppError` subclass from
  [src/shared/errors/app-error.ts](src/shared/errors/app-error.ts); the global
  handler in [src/shared/errors/error-handler.ts](src/shared/errors/error-handler.ts)
  maps them to responses. Don't hand-roll status codes in routes.
- All API routes are mounted under `/api` (the `.group('/api', …)` in
  [src/app.ts](src/app.ts)).

## Adding a new module

1. `mkdir src/modules/<name>` and add `<name>.schema.ts`, `<name>.service.ts`,
   `<name>.repository.ts` (skip repository if the module has no data access, like
   `health`), `<name>.route.ts`.
2. Export the routes as an Elysia instance from `<name>.route.ts`.
3. Register it in [src/app.ts](src/app.ts): `.group('/api', (api) => api.use(...).use(<name>Routes))`.
4. Add `src/tests/<name>.test.ts` using `bun:test` + `app.handle(new Request(...))`.

## Testing

Bun's built-in runner. Call the app directly — no server needed:

```ts
import { app } from '../app';
const res = await app.handle(new Request('http://localhost/api/health'));
```

Run with `bun run test` (from the repo root) or `bun test apps/backend`.
