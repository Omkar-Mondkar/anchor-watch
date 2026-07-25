## 1. OpenAPI 3.1 Specification

- [x] 1.1 Create `docs/api/` directory and scaffold `openapi.yaml` with OpenAPI 3.1 info block, servers array (http://localhost/api for dev, https://{host}/api for prod), and empty paths/components sections
- [x] 1.2 Define `components/securitySchemes` — BearerAuth (JWT in Authorization header)
- [x] 1.3 Define all 9 entity schemas in `components/schemas`: `Server`, `ServerProfile`, `Baseline`, `ConfigItem`, `Drift`, `Alert`, `Audit`, `AgentEnrollment`, `MonitorCard`
- [x] 1.4 Define common response schemas in `components/schemas`: `ErrorResponse`, `PaginatedResponse`, `HealthResponse`
- [x] 1.5 Write Auth paths: `POST /api/auth/login`, `POST /api/auth/refresh` with request/response schemas and 401/200 examples
- [x] 1.6 Write Server paths: `GET /api/servers` (with page, limit, environment, status query params), `POST /api/servers`, `GET /api/servers/:id`, `PUT /api/servers/:id`, `DELETE /api/servers/:id`
- [x] 1.7 Write ServerProfile paths: `GET /api/profiles`, `POST /api/profiles`, `GET /api/profiles/:id`, `PUT /api/profiles/:id`
- [x] 1.8 Write Agent paths: `POST /api/servers/:id/enroll`, `POST /api/agent/register`, `POST /api/agent/heartbeat`, `POST /api/agent/upload` — document full snapshot upload schema
- [x] 1.9 Write Baseline paths: `GET /api/servers/:id/baselines`, `POST /api/servers/:id/baselines`, `GET /api/baselines/:id`, `PUT /api/baselines/:id/approve`
- [x] 1.10 Write Drift and Diff paths: `GET /api/servers/:id/drift`, `GET /api/drift/:id`, `PUT /api/drift/:id/acknowledge`, `GET /api/servers/:id/diff?mode=side-by-side|inline|json`
- [x] 1.11 Write Alert paths: `GET /api/alerts` (with status, severity, serverId filters), `GET /api/alerts/:id`, `PUT /api/alerts/:id/resolve`
- [x] 1.12 Write Monitoring Tool paths: `POST /api/monitor/signal`, `GET /api/monitor/cards`, `POST /api/monitor/cards`, `PUT /api/monitor/cards/:id` — include MonitorCard $ref
- [x] 1.13 Write Webhook path: `POST /api/webhooks/drift` — document `X-Webhook-Signature` header, payload schema, 401 on invalid signature
- [x] 1.14 Write Audit path: `GET /api/audit` with page, limit, entity, user, startDate, endDate query params
- [x] 1.15 Write Compliance paths: `GET /api/compliance/summary`, `GET /api/compliance/servers`
- [x] 1.16 Write Schedule paths: `GET /api/schedules`, `POST /api/schedules`, `PUT /api/schedules/:id`
- [x] 1.17 Run `swagger-cli validate docs/api/openapi.yaml` — must exit 0

## 2. Postman Collection

- [x] 2.1 Generate `docs/api/postman_collection.json` from the OpenAPI spec (use `openapi-to-postmanv2` or manual authoring) — all folders and requests present
- [x] 2.2 Verify the collection imports into Postman without errors

## 3. Data Model Documentation

- [x] 3.1 Create `docs/api/data-model.md` with: overview paragraph, ASCII entity relationship diagram, and per-entity sections covering fields, relationships, design decisions, and index strategy
- [x] 3.2 Document the `scope`/`scopeId` pattern in Baseline with a worked example (server-level vs profile-level baseline)
- [x] 3.3 Document Audit append-only design and why it is enforced at the model layer not just via RBAC
- [x] 3.4 Document MonitorCard structure and how it maps to the `error_signal_sending` script invocation

## 4. Mongoose Models

- [x] 4.1 Create `backend/src/models/Server.js` — schema with all fields, indexes on `environment` and `status`, timestamps
- [x] 4.2 Create `backend/src/models/ServerProfile.js` — schema with `collectorConfig` array sub-schema, timestamps
- [x] 4.3 Create `backend/src/models/Baseline.js` — schema with `scope`/`scopeId` pattern, compound unique index on scope+scopeId+version
- [x] 4.4 Create `backend/src/models/ConfigItem.js` — schema with `category` enum and index on `baselineId`
- [x] 4.5 Create `backend/src/models/Drift.js` — schema with `severity` and `status` enums, index on `serverId + status`
- [x] 4.6 Create `backend/src/models/Alert.js` — schema with `driftIds` array and `channel` enum, timestamps
- [x] 4.7 Create `backend/src/models/Audit.js` — schema with append-only middleware blocking all update/delete operations with error "Audit records are immutable", index on `entity + timestamp`
- [x] 4.8 Create `backend/src/models/AgentEnrollment.js` — schema with `tokenHash` index, `expiresAt` field, `status` enum
- [x] 4.9 Create `backend/src/models/MonitorCard.js` — schema with `monitoringId` pattern validation (/^\d{5}$/), nullable `serverId` and `category`, timestamps
- [x] 4.10 Create `backend/src/models/index.js` — barrel export of all 9 models

## 5. Mongoose Connection in App

- [x] 5.1 Modify `backend/src/app.js` — add `mongoose.connect(config.mongoUri)` on startup; log "MongoDB connected" on success; log error and `process.exit(1)` on failure
- [x] 5.2 Verify backend starts and connects to MongoDB when running in dev compose stack
- [x] 5.3 Verify `GET /api/health` still returns 200 after adding Mongoose connection (no regression)

## 6. Verification

- [x] 6.1 Run `swagger-cli validate docs/api/openapi.yaml` — exit 0
- [x] 6.2 Run `node -e "require('./backend/src/models')"` — exit 0 with all 9 models logged
- [x] 6.3 Write a quick test asserting `Audit.updateOne({},{})` throws "Audit records are immutable"
- [x] 6.4 Run `curl http://localhost/api/health` in running dev stack — still returns 200 JSON
- [x] 6.5 Import `postman_collection.json` into Postman — all folders visible, no import errors
