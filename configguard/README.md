# ConfigGuard

**Enterprise Configuration Baseline & Drift Detection Platform**

ConfigGuard monitors, validates, and alerts on configuration drift across Linux trading infrastructure servers.

---

## Prerequisites

- Docker Engine 24+ and Docker Compose v2
- Node.js 20+ (for local frontend/backend development outside Docker)
- Python 3.12+ (for running the agent on Linux hosts)
- Corporate CA-signed TLS certificate (production only)

---

## Getting Started

### 1. Clone and configure

```bash
git clone <repo-url>
cd configguard
cp .env.example .env
# Edit .env and fill in all required values
```

### 2. Development stack (with hot-reload)

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Services started:
- **nginx** → https://localhost (TLS) / http://localhost (redirects to HTTPS)
- **frontend** → React app (hot-reload via Vite dev server)
- **backend** → Express API on :5000 (hot-reload via nodemon)
- **mongodb** → :27017 (internal only)
- **redis** → :6379 (internal only)
- **mongo-express** → http://localhost:8081 (DB admin UI, dev only)
- **agent-mock** → simulates agent push (dev only)

### 3. Production stack

```bash
# Mount your corporate CA cert and key, then:
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 4. Initialise the database

```bash
docker exec -it configguard-backend node /app/scripts/init-mongo.js
```

### 5. Load dev fixtures (optional)

```bash
docker exec -it configguard-backend node /app/scripts/seed-dev.js
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | Yes | `development` or `production` |
| `PORT` | Yes | Backend listen port (default: 5000) |
| `JWT_SECRET` | Yes | Minimum 64-char random string for JWT signing |
| `JWT_EXPIRY` | Yes | JWT access token expiry (e.g. `8h`) |
| `AGENT_TOKEN_EXPIRY` | Yes | Agent enrollment token expiry (e.g. `1h`) |
| `MONGO_URI` | Yes | MongoDB connection string |
| `MONGO_LDAP_SERVERS` | Prod | Azure AD LDAP server URL (e.g. `ldaps://ad.corp.com:636`) |
| `MONGO_LDAP_BIND_DN` | Prod | Service account DN for LDAP bind |
| `MONGO_LDAP_BIND_PASSWORD` | Prod | Service account password |
| `REDIS_URL` | Yes | Redis connection URL |
| `NGINX_SSL_CERT_PATH` | Prod | Path to TLS cert inside nginx container |
| `NGINX_SSL_KEY_PATH` | Prod | Path to TLS key inside nginx container |
| `MONITOR_TOOL_API_URL` | Yes | Corporate monitoring tool base API URL |
| `MONITOR_TOOL_API_KEY` | Yes | API key for monitoring tool |
| `MONITOR_TOOL_DEFAULT_CARD_ID` | Yes | Default 5-digit monitoring card ID |
| `MONITOR_SIGNAL_SCRIPT` | Yes | Path to `error_signal_sending` script in backend container |
| `WEBHOOK_SECRET` | Yes | HMAC secret for validating incoming drift webhooks |

---

## Project Structure

```
configguard/
├── frontend/       React 18 + TypeScript + MUI v5 + Tailwind + Redux Toolkit
├── backend/        Node.js 20 + Express + Mongoose + BullMQ
├── agent/          Python 3.12 — deployed natively on Linux hosts (NOT in prod compose)
├── nginx/          Reverse proxy + TLS termination
├── docs/api/       OpenAPI 3.1 spec + data model docs
├── scripts/        DB init and dev seed scripts
└── openspec/       OpenSpec spec-driven development artifacts
```

---

## Agent Deployment

The Python agent is **not** part of the Docker Compose stack. It is installed directly on each Linux trading host:

```bash
# On the Linux host
pip install -r agent/requirements.txt
python agent/collector.py --server-id <server-id> --api-url https://<configguard-host>/api
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, MUI v5, Tailwind CSS v3, Redux Toolkit, Vite |
| Backend | Node.js 20, Express, Mongoose, BullMQ, JWT |
| Database | MongoDB 7 (Azure AD LDAP auth in production) |
| Queue | Redis 7 (BullMQ ingestion queue) |
| Proxy | nginx (TLS termination, reverse proxy) |
| Agent | Python 3.12 (pluggable collector registry, push-only) |
