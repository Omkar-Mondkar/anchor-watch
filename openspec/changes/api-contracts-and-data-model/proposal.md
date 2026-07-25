## Why

The React frontend and the Node.js backend must be built and tested against a shared contract. Without an OpenAPI 3.1 specification and fully defined Mongoose data models, the frontend team cannot make API calls, the backend team has no schema to implement against, and the monitoring tool integration has no documented webhook shape. This change produces the **bridge document** — the single artifact that makes frontend and backend development independent and parallel.

## What Changes

- Add `docs/api/openapi.yaml` — full OpenAPI 3.1 specification covering all 40+ endpoints across 12 resource groups (auth, servers, profiles, agent, baselines, drift, alerts, monitoring tool, webhooks, audit, compliance, schedules)
- Add `docs/api/data-model.md` — human-readable description of all 9 Mongoose entities, relationships, design decisions, and index strategy
- Add `docs/api/postman_collection.json` — importable Postman collection generated from the OpenAPI spec
- Add `backend/src/models/Server.js` — Mongoose schema
- Add `backend/src/models/ServerProfile.js` — Mongoose schema
- Add `backend/src/models/Baseline.js` — Mongoose schema
- Add `backend/src/models/ConfigItem.js` — Mongoose schema
- Add `backend/src/models/Drift.js` — Mongoose schema
- Add `backend/src/models/Alert.js` — Mongoose schema
- Add `backend/src/models/Audit.js` — append-only Mongoose schema (no update/delete middleware)
- Add `backend/src/models/AgentEnrollment.js` — Mongoose schema
- Add `backend/src/models/MonitorCard.js` — Mongoose schema for corporate monitoring tool card mappings
- Add `backend/src/models/index.js` — barrel export for all models
- Modify `backend/src/app.js` — wire Mongoose connection using `MONGO_URI` from config

## Capabilities

### New Capabilities

- `openapi-spec`: Full OpenAPI 3.1 specification for all ConfigGuard API endpoints — the frontend bridge document
- `data-model`: Nine Mongoose schemas covering all entities in the data model; connection wired in Express app
- `monitoring-tool-contract`: OpenAPI paths and Mongoose schema for `MonitorCard`, the corporate monitoring tool integration and open webhook endpoint

### Modified Capabilities

- `backend-scaffold`: Mongoose connection added to `app.js` — the scaffold from Change 0 now connects to MongoDB at startup

## Impact

- **`docs/api/openapi.yaml`**: New file — hand this to a frontend build context to develop the React UI independently
- **`backend/src/models/`**: Nine new Mongoose model files; importable immediately by future controllers
- **`backend/src/app.js`**: Mongoose `connect()` call added — requires `MONGO_URI` to be set in `.env`
- **No new HTTP routes return real data yet**: placeholder 501 routes remain; models and contracts are the deliverable
- **Dependencies**: No new npm packages (mongoose is already in package.json from Change 0)
