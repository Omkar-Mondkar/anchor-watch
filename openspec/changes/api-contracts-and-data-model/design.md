## Context

Change 0 (`repo-bootstrap`) established the project scaffold with stub routes returning 501. This change defines the full API contract and data model that all subsequent changes implement against. The data model is drawn from the refined PRD (Part A of the build guide) with one addition: `MonitorCard` for the corporate monitoring tool integration.

**Constraints:**
- 9 entities total (8 from refined PRD + MonitorCard)
- `Audit` is append-only — no update/delete Mongoose middleware
- `Baseline` uses scope/scopeId pattern (not per-host foreign key) to support both server-level and profile-level baselines
- `MonitorCard` stores the 5-digit monitoring ID and the path to the `error_signal_sending` script
- OpenAPI spec must be self-sufficient — a frontend developer with only this file can build the entire UI

## Goals / Non-Goals

**Goals:**
- Produce a valid, complete OpenAPI 3.1 spec that passes `swagger-cli validate`
- Define all 9 Mongoose schemas with correct types, required fields, indexes, and timestamps
- Wire Mongoose connection into the Express app
- Produce a Postman collection importable directly from the OpenAPI spec
- Produce `data-model.md` explaining entity relationships and design decisions

**Non-Goals:**
- No controller or service logic — routes still return 501
- No JWT auth middleware implementation — that is Change 2
- No agent upload handling — that is Change 4
- No actual diff engine — that is Change 6

## Decisions

### D1 — OpenAPI 3.1 over Swagger 2.0

**Decision**: Use OpenAPI 3.1 (not 2.0/Swagger).

**Rationale**: 3.1 is fully JSON Schema aligned, supports `oneOf`/`anyOf` without workarounds, and is the current standard. Postman, Insomnia, and all major mock-server tools support it. Spec Kit and OpenSpec tooling are neutral on version.

---

### D2 — `Baseline` uses `scope` + `scopeId` instead of just `serverId`

**Decision**: `Baseline` has `scope: "server" | "profile"` and `scopeId: ObjectId`. No `serverId` field.

**Rationale**: The PRD allows baselines at both the per-host level and the server-profile level (so 50 identical trading-edge nodes share one baseline). A separate `serverId` field would be ambiguous (null for profile baselines? duplicate data for server baselines?). The `scope` pattern is clean, queryable, and self-documenting.

**Alternative considered**: Two separate collections (`ServerBaseline`, `ProfileBaseline`). Rejected — duplicates schema; query patterns are the same; frontend diff view doesn't care which type it is.

---

### D3 — `Audit` is append-only at the schema level

**Decision**: `Audit` Mongoose schema uses a pre-save hook to block all `findOneAndUpdate`, `updateOne`, `updateMany`, `findOneAndDelete`, `deleteOne`, `deleteMany` operations with a thrown error.

**Rationale**: The PRD names Auditors as a user role with read-only access and audit trail requirements. Immutability must be enforced in the application layer (not just by RBAC) so that even a compromised admin token cannot alter audit history.

---

### D4 — `MonitorCard` stores script path and monitoring ID together

**Decision**: `MonitorCard` has `monitoringId` (5-digit string), `scriptPath` (absolute path on the backend host), `serverId?`, `category?`, and `severityThreshold`.

**Rationale**: The backend shells out to the `error_signal_sending` script with the monitoring ID as an argument. Storing both in the same document means the alert engine only needs one DB lookup per dispatch. `serverId` and `category` are both nullable so a card can apply at fleet-wide, per-server, or per-category scope.

---

### D5 — All models export from a barrel `index.js`

**Decision**: `backend/src/models/index.js` re-exports all 9 models. Controllers import from `../models` not from individual files.

**Rationale**: Prevents circular dependency issues as models grow, and makes mocking in tests trivial (mock the whole barrel).

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| OpenAPI spec goes stale as routes are implemented | The spec is the source of truth; controllers must match it. Swagger-UI middleware in dev exposes the spec live at `/api/docs` so discrepancies are immediately visible |
| `scope`/`scopeId` pattern unfamiliar to team | `data-model.md` documents it with a worked example; all query helpers abstract the pattern |
| Append-only Audit middleware could be forgotten if a new model extends Audit | Unit test asserts that `Audit.findOneAndDelete` throws; CI will catch regressions |
| MonitorCard `scriptPath` is a server filesystem path — fragile in Docker | Script is bind-mounted into the backend container via compose; path is configurable via env `MONITOR_SIGNAL_SCRIPT` |

## Migration Plan

1. Change 0 must be merged first (Mongoose dep in package.json required)
2. Run `node backend/src/models/index.js` — confirms all 9 schemas load without error
3. Run `swagger-cli validate docs/api/openapi.yaml` — must pass
4. Verify `GET /api/health` still responds (no regression from Mongoose connect)
5. Hand `docs/api/openapi.yaml` + `docs/api/data-model.md` to frontend build context
