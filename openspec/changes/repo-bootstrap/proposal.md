## Why

ConfigGuard requires a fully scaffolded MERN + Python-agent monorepo before any feature work can begin. Without a working Docker-based foundation — covering nginx (TLS termination), React frontend, Node.js backend, MongoDB (Azure AD LDAP), Redis (BullMQ), and a standalone Python agent skeleton — every subsequent OpenSpec change would be building on an undefined base, making collaboration and CI impossible.

## What Changes

- Create the `configguard/` monorepo directory structure covering `frontend/`, `backend/`, `agent/`, `nginx/`, `docs/`, `scripts/`, and `openspec/`
- Add `docker-compose.yml` (base), `docker-compose.dev.yml` (hot-reload + agent-mock + mongo-express), and `docker-compose.prod.yml` (resource limits, restart policies, healthchecks)
- Add `frontend/Dockerfile` — multi-stage build: `node:20-alpine` → `nginx:alpine`
- Add `backend/Dockerfile` — `node:20-alpine`, `nodemon` in dev
- Add `agent/Dockerfile` — `python:3.12-slim` for dev/mock simulation only
- Add `nginx/Dockerfile` + `nginx.conf` — HTTP→HTTPS redirect, TLS termination on `:443`, proxy `/api/*` → backend, static serve `/*` → frontend, HSTS headers
- Add `frontend/` Vite + React 18 + TypeScript scaffold with all page stubs and npm dependencies
- Add `backend/` Express skeleton with health-check route, CORS, Morgan, env-driven config, and placeholder router mounts
- Add `agent/` Python skeleton with stub collector modules and plugin registry
- Add `.env.example` with all required variables (MongoDB LDAP, Redis, JWT, TLS paths, monitoring tool, webhook secret)
- Add `scripts/init-mongo.js` — creates app service account and collection indexes
- Add `scripts/seed-dev.js` — dev fixtures for 3 mock servers
- Add `README.md` — getting started, docker-compose commands, env variable reference

## Capabilities

### New Capabilities

- `monorepo-scaffold`: Top-level directory structure, root configuration files, `.env.example`, and `README.md` for the configguard monorepo
- `docker-compose-stack`: Full multi-service Docker Compose setup (nginx, frontend, backend, mongodb, redis) with dev and prod override files
- `nginx-tls-proxy`: nginx configuration for TLS termination with corporate CA-signed certificate, HTTP→HTTPS redirect, reverse proxy routing, and security headers
- `frontend-scaffold`: Vite + React 18 + TypeScript project with MUI v5, Tailwind CSS v3, Redux Toolkit, and all six page stubs (Dashboard, Servers, Baselines, DriftAnalyzer, Alerts, AuditLogs)
- `backend-scaffold`: Express app skeleton with health-check endpoint, middleware chain (CORS, JSON, Morgan), env-driven config, and placeholder router mounts
- `agent-scaffold`: Python agent skeleton with pluggable collector registry, stub collector modules, enrollment stub, and uploader stub

### Modified Capabilities

*(none — this is the initial scaffold, no existing specs to modify)*

## Impact

- **Creates**: all top-level directories and files; no existing code is modified
- **Docker**: requires Docker Engine 24+ and Docker Compose v2 on the production server
- **Dependencies**: Node.js 20 (frontend + backend), Python 3.12 (agent), nginx 1.25+, MongoDB 7, Redis 7
- **Ports exposed by nginx**: 80 (redirect only), 443 (HTTPS — requires corporate CA cert mounted at runtime)
- **No application logic yet**: all routes return stubs; all collectors return empty dicts
