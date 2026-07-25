## 1. Repository Root

- [x] 1.1 Create `.env.example` with all required variables (NODE_ENV, JWT_SECRET, JWT_EXPIRY, AGENT_TOKEN_EXPIRY, MONGO_URI, MONGO_LDAP_SERVERS, MONGO_LDAP_BIND_DN, MONGO_LDAP_BIND_PASSWORD, REDIS_URL, NGINX_SSL_CERT_PATH, NGINX_SSL_KEY_PATH, MONITOR_TOOL_API_URL, MONITOR_TOOL_API_KEY, MONITOR_TOOL_DEFAULT_CARD_ID, MONITOR_SIGNAL_SCRIPT, WEBHOOK_SECRET)
- [x] 1.2 Create `README.md` with project overview, prerequisites, getting-started steps for dev and prod, env variable reference table
- [x] 1.3 Create `.gitignore` covering node_modules, .env, dist, __pycache__, *.pyc, .DS_Store, *.pem, *.key
- [x] 1.4 Create `docker-compose.yml` base file (nginx, frontend, backend, mongodb, redis) with named volumes and internal networks

## 2. Docker Compose — Dev and Prod Overrides

- [x] 2.1 Create `docker-compose.dev.yml` — add hot-reload bind mounts for frontend and backend, add agent-mock service, add mongo-express on port 8081, set `CHOKIDAR_USEPOLLING=true` for frontend
- [x] 2.2 Create `docker-compose.prod.yml` — add `restart: always`, memory/CPU limits (backend: 512m/0.5cpu, mongodb: 2g/1cpu, redis: 256m/0.25cpu), healthcheck definitions for all services, json-file log driver with size rotation

## 3. nginx Service

- [x] 3.1 Create `nginx/Dockerfile` based on `nginx:alpine`
- [x] 3.2 Create `nginx/nginx.conf` with: HTTP→HTTPS redirect on :80, TLS termination on :443 with cert/key from env-configured paths, upstream proxy for `/api/*` → backend:5000, static file serving for `/*` with `try_files $uri /index.html`, HSTS + security headers
- [x] 3.3 Create `nginx/conf.d/configguard.conf` with server block splitting proxy and static rules

## 4. Frontend Scaffold

- [x] 4.1 Initialise Vite + React 18 + TypeScript project in `frontend/` (`npm create vite@latest . -- --template react-ts`)
- [x] 4.2 Install all required packages: `@mui/material@5`, `@mui/icons-material@5`, `@emotion/react`, `@emotion/styled`, `tailwindcss@3`, `@reduxjs/toolkit`, `react-redux`, `axios`, `react-router-dom`, `recharts`, `react-diff-viewer-continued`
- [x] 4.3 Configure Tailwind CSS v3 (`tailwind.config.ts`, `postcss.config.js`, import in `index.css`)
- [x] 4.4 Configure MUI v5 theme with ConfigGuard dark palette (Background: #0B1220, Surface: #111827, Success: #22C55E, Warning: #F59E0B, Critical: #EF4444, Accent: #3B82F6)
- [x] 4.5 Create `src/main.tsx` — wrap app in MuiThemeProvider + ReduxProvider + BrowserRouter
- [x] 4.6 Create `src/App.tsx` — React Router routes for all 6 pages (/, /servers, /baselines, /drift, /alerts, /audit)
- [x] 4.7 Create placeholder page components: `Dashboard.tsx`, `Servers.tsx`, `Baselines.tsx`, `DriftAnalyzer.tsx`, `Alerts.tsx`, `AuditLogs.tsx` — each renders a heading only
- [x] 4.8 Create stub layout components: `components/layout/Sidebar.tsx`, `components/layout/Header.tsx`
- [x] 4.9 Create `frontend/Dockerfile` — multi-stage (node:20-alpine build → nginx:alpine serve)
- [x] 4.10 Create `frontend/nginx.conf` — in-container nginx for SPA routing (`try_files $uri /index.html`)
- [x] 4.11 Create `frontend/vite.config.ts` — configure dev server proxy to backend for local development outside Docker

## 5. Backend Scaffold

- [x] 5.1 Initialise `backend/package.json` with Express, CORS, Morgan, dotenv, mongoose, ioredis, bullmq, jsonwebtoken, bcryptjs, joi; devDependencies: nodemon
- [x] 5.2 Create `backend/src/config.js` — load and validate all env variables at startup; throw descriptive error for missing required vars
- [x] 5.3 Create `backend/src/app.js` — Express app with middleware chain (CORS, JSON body, Morgan) and global error handler
- [x] 5.4 Create `backend/src/routes/health.js` — `GET /api/health` returns `{"status":"ok","timestamp":"<ISO>"}`
- [x] 5.5 Add placeholder router mounts in app.js for all future route groups (servers, profiles, agent, baselines, drift, alerts, audit, compliance, schedules, monitor, webhooks) — each returns 501 Not Implemented
- [x] 5.6 Create `backend/Dockerfile` — `node:20-alpine`, `npm ci --omit=dev`, `CMD ["node","src/app.js"]`

## 6. Agent Scaffold

- [x] 6.1 Create `agent/requirements.txt` with: `requests`, `python-dotenv`, `click`, `cryptography`
- [x] 6.2 Create `agent/collectors/__init__.py` — `CollectorRegistry` class with `register()` and `run_all()` methods
- [x] 6.3 Create stub collector modules: `sysctl.py`, `cpu.py`, `irq.py`, `nic.py`, `ha.py`, `ntp.py`, `memory.py`, `custom_files.py` — each exports `collect() -> dict` returning `{}`
- [x] 6.4 Create `agent/collector.py` — CLI entrypoint with `--server-id` and `--api-url` args, imports registry, runs `run_all()`, prints JSON output
- [x] 6.5 Create stub `agent/normalizer.py` — `normalize(raw: dict) -> dict` returns input unchanged at this stage
- [x] 6.6 Create stub `agent/enrollment.py` — `enroll(api_url, token) -> str` prints "enrollment stub" and returns empty string
- [x] 6.7 Create stub `agent/uploader.py` — `upload(api_url, jwt, payload) -> bool` prints "upload stub" and returns True
- [x] 6.8 Create `agent/Dockerfile` — `python:3.12-slim`, `pip install -r requirements.txt` (dev/mock use only)

## 7. Scripts

- [x] 7.1 Create `scripts/init-mongo.js` — creates `svc_configguard` MongoDB user with read/write on `configguard` DB; creates placeholder indexes for all future collections
- [x] 7.2 Create `scripts/seed-dev.js` — inserts 3 mock server documents (TNSI1, TNSI2, EAGLE1) for development

## 8. Verification

- [x] 8.1 Run `docker-compose -f docker-compose.yml -f docker-compose.dev.yml config` — validate compose files without errors
- [x] 8.2 Run `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up` — confirm all services start healthy
- [x] 8.3 Verify `curl http://localhost/api/health` returns HTTP 200 `{"status":"ok"}`
- [x] 8.4 Verify frontend loads at `https://localhost` (accept self-signed cert in dev)
- [x] 8.5 Run `cd frontend && npm run build` — confirm Vite build produces /dist without errors
- [x] 8.6 Run `cd agent && pip install -r requirements.txt && python collector.py --server-id test-01 --api-url http://localhost/api` — confirm exits 0 with JSON output
