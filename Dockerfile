# syntax=docker/dockerfile:1
# ─────────────────────────────────────────────────────────────────────────────
# Bungkit — single-container image.
# One Bun process serves everything from one origin:
#     domain.com/        -> Angular SPA (deep links fall back to the app shell)
#     domain.com/api/*   -> ElysiaJS API
#
# Build:  docker build -t bungkit .
# Run:    docker run -p 3000:3000 bungkit
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: build both apps ─────────────────────────────────────────────────
FROM oven/bun:1.3 AS builder
WORKDIR /app

# Install deps first so this layer is cached until the manifest/lockfile changes.
# Angular's `ng build` needs devDependencies, so this is a full (non-prod) install.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Public build-time config baked into the Angular browser bundle by
# scripts/generate-env.ts (allowlist: PUBLIC_KEYS). NEVER pass secrets here —
# anything baked in ships to the browser.
#   API_URL="" => the SPA calls the API with a relative /api on the same origin,
#   which is exactly what this single-container, same-domain setup wants.
ARG API_URL=""
ARG APP_NAME="Bungkit"
ENV API_URL=$API_URL \
    APP_NAME=$APP_NAME

# Copy sources and build: dist/public (SPA) + dist/backend/main.js (API bundle).
COPY . .
RUN bun run build

# ── Stage 2: minimal runtime ─────────────────────────────────────────────────
# `bun build --target bun` bundles all npm deps into main.js, so the runtime
# image needs only Bun + the dist/ tree — no node_modules.
FROM oven/bun:1.3-slim AS runner
WORKDIR /app

# API_PORT is what the backend reads (env.ts); a PaaS-injected PORT also works.
ENV NODE_ENV=production \
    API_PORT=3000

# The server resolves PUBLIC_DIR as <cwd>/dist/public, so keep the dist/ layout
# intact and run from /app.
COPY --from=builder --chown=bun:bun /app/dist ./dist

# Drop root — the oven/bun images ship a non-root `bun` user.
USER bun

EXPOSE 3000

# Liveness via the API's own health route.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD bun -e "fetch('http://localhost:'+(process.env.API_PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["bun", "dist/backend/main.js"]
