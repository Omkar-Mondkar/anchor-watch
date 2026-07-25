## ADDED Requirements

### Requirement: MonitorCard API endpoints are documented in OpenAPI spec
The OpenAPI spec SHALL define all 5 monitoring tool endpoints: `POST /api/monitor/signal`, `POST /api/webhooks/drift`, `GET /api/monitor/cards`, `POST /api/monitor/cards`, `PUT /api/monitor/cards/:id`. Each SHALL include request/response schemas and security requirements.

#### Scenario: External team integrates with the webhook
- **WHEN** an external team reads POST /api/webhooks/drift in the spec
- **THEN** they see the full payload schema, required `X-Webhook-Signature` header definition, and example 401 / 200 responses

### Requirement: Webhook endpoint validates signature
The `POST /api/webhooks/drift` endpoint schema SHALL document an `X-Webhook-Signature` header (SHA-256 HMAC of body with `WEBHOOK_SECRET`). The spec SHALL describe 401 as the response when the signature is invalid or missing.

#### Scenario: Webhook is called without signature
- **WHEN** POST /api/webhooks/drift is called without X-Webhook-Signature
- **THEN** the documented response is HTTP 401 {"error":"Invalid or missing webhook signature"}

### Requirement: MonitorCard model is in the OpenAPI components/schemas
The `MonitorCard` schema SHALL appear in `components/schemas` with all fields: `label`, `monitoringId` (pattern: ^\d{5}$), `serverId`, `category`, `severityThreshold`, `scriptPath`, `isActive`. Required fields SHALL be marked.

#### Scenario: MonitorCard schema is referenced by monitoring endpoints
- **WHEN** a developer reads GET /api/monitor/cards in the spec
- **THEN** the response references the MonitorCard schema via $ref
