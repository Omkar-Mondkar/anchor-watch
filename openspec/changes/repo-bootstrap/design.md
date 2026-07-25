## Context

ConfigGuard is a MERN + Python-agent monorepo targeting corporate on-premises Linux servers. OpenSpec was just initialized (`openspec init`). No application code exists yet. This change creates every file needed to boot the full stack via Docker Compose, establishing the foundation every subsequent change builds upon.

**Constraints:**
- Deployment: corporate on-premises production server (no cloud)
- TLS: nginx terminates TLS; corporate CA-signed cert mounted via Docker volume
- MongoDB auth: Azure AD LDAP (`authMechanism=PLAIN`, `authSource=$external`)
- Frontend: React 18 + TypeScript + MUI v5 + Tailwind CSS v3 + Redux Toolkit (Vite)
- Backend: Node.js 20 + Express
- Agent: Python 3.12 — push-only, profile-driven, NOT in production compose
- Alert channel: corporate monitoring tool (5-digit card IDs) + open webhook API

## Goals / Non-Goals

**Goals:**
- Full monorepo directory tree scaffolded and documented
- `docker-compose up` (dev profile) starts all services and reaches healthy state
- nginx correctly terminates TLS and proxies traffic to backend + frontend
- Backend health-check endpoint returns 200
- Frontend renders placeholder in browser
- `.env.example` documents every required environment variable
- CI: `docker-compose config` validates without errors

**Non-Goals:**
- No application business logic (routes, controllers, models — those are Change 1+)
- No real agent connectivity to Linux hosts (agent-mock only for dev)
- No MongoDB schema creation (handled by `init-mongo.js` and Change 1 models)
- No SSL certificate provisioning (cert is mounted from the host at deploy time)

## Decisions

### D1 — Three compose files (base / dev / prod) instead of one

**Decision**: Split into `docker-compose.yml` (shared), `docker-compose.dev.yml` (dev overrides), `docker-compose.prod.yml` (prod overrides).

**Rationale**: Keeps production compose free of dev-only services (agent-mock, mongo-express) and bind-mount hot-reload volumes. Prod overrides add `restart: always`, resource limits, and healthcheck definitions. This is the standard Docker Compose override pattern for multi-environment monorepos.

**Alternative considered**: Single compose file with profiles. Rejected because `--profile dev` is easier to forget than explicit `-f` flags, and the override pattern maps better to future CI matrix testing.

---

### D2 — Multi-stage Dockerfile for frontend (build node → serve nginx)

**Decision**: Frontend Dockerfile uses two stages: `node:20-alpine` builds the Vite bundle, then `nginx:alpine` copies `/dist` and serves it statically.

**Rationale**: The production frontend image has zero Node.js runtime — only nginx + static files. This significantly reduces attack surface and image size. The in-container nginx for the frontend only handles SPA routing (`try_files $uri /index.html`); TLS and proxy routing are handled by the outer nginx service.

---

### D3 — Agent is NOT in production docker-compose

**Decision**: The Python agent has a `Dockerfile` for dev/mock only. `docker-compose.prod.yml` does not include an `agent` service.

**Rationale**: The real agent runs natively on each Linux trading host (TNSI1, TNSI2, EAGLE1 etc.) and pushes outbound to the nginx endpoint. Packaging it in compose would imply it runs on the management server, which contradicts the push-only, host-native design. `agent-mock` in `docker-compose.dev.yml` simulates real agents for development.

---

### D4 — MongoDB LDAP via Azure AD (PLAIN mechanism)

**Decision**: MongoDB configured with `security.ldap` pointing to Azure AD LDAP endpoint. Application connects with `authMechanism=PLAIN&authSource=$external`. A service account (`svc_configguard`) in Azure AD is the bind account.

**Rationale**: Centralized identity management in Azure AD means no separate MongoDB user database to maintain. Role mapping (Admin/Engineer/Auditor) is done via Azure AD security group → MongoDB role mapping in `mongoldap.conf`. This satisfies corporate SSO requirements.

**Trade-off**: Requires `mongoldap` process (or a compatible LDAP proxy) to be running; adds an external dependency. In dev, we fall back to SCRAM-SHA-256 local auth for simplicity.

---

### D5 — nginx handles HTTP→HTTPS redirect + all security headers

**Decision**: nginx:443 terminates TLS; nginx:80 returns 301 redirect to HTTPS. Security headers (HSTS, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection) added at the nginx layer, not the Express app.

**Rationale**: Centralizes all HTTP-layer security in one place. Express doesn't need to know about TLS at all — it only receives plain HTTP from the internal Docker network.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Dev team forgets to copy `.env.example` → `.env` | `docker-compose up` will fail loudly with clear missing-variable errors; README documents the step explicitly |
| Corporate CA cert not available at dev time | Dev compose uses self-signed cert generated at startup; prod compose requires the real cert path to be set in `.env` |
| Azure AD LDAP latency at MongoDB connect time | Connection pool (Mongoose `poolSize`) configured generously; LDAP server URL is configurable via env |
| Vite dev server hot-reload across Docker bind-mount | `CHOKIDAR_USEPOLLING=true` set in dev compose env; minor CPU overhead but reliable on all host OSes |
| `agent-mock` container diverging from real agent behavior | agent-mock is intentionally thin — it only exercises the upload API. Real agent testing happens on actual Linux hosts |

## Migration Plan

1. Clone repo (after this change merges)
2. `cp .env.example .env` and fill in values
3. For dev: `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`
4. For prod: mount corporate CA cert, set `NGINX_SSL_CERT_PATH` / `NGINX_SSL_KEY_PATH`, then `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
5. Verify: `curl -k https://localhost/api/health` → `{"status":"ok"}`

**Rollback**: `docker-compose down -v` removes all containers and volumes. This is the first change so there is no prior state to restore.
