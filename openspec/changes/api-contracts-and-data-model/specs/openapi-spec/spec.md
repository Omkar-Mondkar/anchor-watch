## ADDED Requirements

### Requirement: OpenAPI 3.1 spec exists and is valid
The file `docs/api/openapi.yaml` SHALL be a valid OpenAPI 3.1 document. Running `swagger-cli validate docs/api/openapi.yaml` SHALL exit 0.

#### Scenario: CI validates the spec
- **WHEN** `swagger-cli validate docs/api/openapi.yaml` is run
- **THEN** the command exits 0 with no errors

### Requirement: Spec covers all Auth endpoints
The spec SHALL define `POST /api/auth/login` (credential login → JWT access + refresh token) and `POST /api/auth/refresh` (refresh token → new access token).

#### Scenario: Login request is documented
- **WHEN** a frontend developer reads the auth section of the spec
- **THEN** they can construct a correct login request body and understand the JWT response shape

### Requirement: Spec covers all Server endpoints
The spec SHALL define: `GET /api/servers` (paginated, filterable by environment and status), `POST /api/servers`, `GET /api/servers/:id`, `PUT /api/servers/:id`, `DELETE /api/servers/:id`.

#### Scenario: Pagination parameters are documented
- **WHEN** a developer reads the GET /api/servers path
- **THEN** `page`, `limit`, `environment`, and `status` query parameters are listed with types and examples

### Requirement: Spec covers all Server Profile endpoints
The spec SHALL define: `GET /api/profiles`, `POST /api/profiles`, `GET /api/profiles/:id`, `PUT /api/profiles/:id`.

#### Scenario: Profile creation is documented
- **WHEN** a developer reads POST /api/profiles
- **THEN** they see the complete request body schema including `collectorConfig` array

### Requirement: Spec covers all Agent endpoints
The spec SHALL define: `POST /api/servers/:id/enroll`, `POST /api/agent/register`, `POST /api/agent/heartbeat`, `POST /api/agent/upload`.

#### Scenario: Agent upload payload is documented
- **WHEN** a developer reads POST /api/agent/upload
- **THEN** they see the full snapshot payload schema with normalized collector output structure

### Requirement: Spec covers all Baseline endpoints
The spec SHALL define: `GET /api/servers/:id/baselines`, `POST /api/servers/:id/baselines`, `GET /api/baselines/:id`, `PUT /api/baselines/:id/approve`.

#### Scenario: Baseline approval is documented
- **WHEN** a developer reads PUT /api/baselines/:id/approve
- **THEN** the required role (Engineer or Admin) is documented in the security description

### Requirement: Spec covers all Drift and Diff endpoints
The spec SHALL define: `GET /api/servers/:id/drift`, `GET /api/drift/:id`, `PUT /api/drift/:id/acknowledge`, `GET /api/servers/:id/diff?mode=side-by-side|inline|json`.

#### Scenario: Diff mode parameter is documented
- **WHEN** a developer reads GET /api/servers/:id/diff
- **THEN** the `mode` query parameter with enum values [side-by-side, inline, json] is listed

### Requirement: Spec covers all Alert endpoints
The spec SHALL define: `GET /api/alerts`, `GET /api/alerts/:id`, `PUT /api/alerts/:id/resolve`.

#### Scenario: Alert list filters are documented
- **WHEN** a developer reads GET /api/alerts
- **THEN** `status`, `severity`, and `serverId` query parameters are listed

### Requirement: Spec covers monitoring tool and webhook endpoints
The spec SHALL define: `POST /api/monitor/signal`, `POST /api/webhooks/drift`, `GET /api/monitor/cards`, `POST /api/monitor/cards`, `PUT /api/monitor/cards/:id`.

#### Scenario: Webhook endpoint is documented for external consumers
- **WHEN** an external team reads POST /api/webhooks/drift
- **THEN** they see the required payload schema, the `X-Webhook-Signature` header, and example error responses

### Requirement: Spec covers Audit, Compliance, and Schedule endpoints
The spec SHALL define: `GET /api/audit` (paginated, filterable), `GET /api/compliance/summary`, `GET /api/compliance/servers`, `GET /api/schedules`, `POST /api/schedules`, `PUT /api/schedules/:id`.

#### Scenario: Audit log is paginated and filterable
- **WHEN** a developer reads GET /api/audit
- **THEN** `page`, `limit`, `entity`, `user`, `startDate`, and `endDate` query parameters are documented

### Requirement: Spec includes reusable component schemas for all 9 entities
The `components/schemas` section of the spec SHALL define schemas for: `Server`, `ServerProfile`, `Baseline`, `ConfigItem`, `Drift`, `Alert`, `Audit`, `AgentEnrollment`, `MonitorCard`. All endpoint request/response bodies SHALL reference these schemas via `$ref`.

#### Scenario: Frontend developer generates TypeScript types from the spec
- **WHEN** `openapi-typescript docs/api/openapi.yaml` is run
- **THEN** TypeScript interfaces are generated for all 9 entity schemas without errors

### Requirement: Postman collection is importable
The file `docs/api/postman_collection.json` SHALL be a valid Postman Collection v2.1 file importable by Postman without errors.

#### Scenario: Developer imports the collection
- **WHEN** a developer imports postman_collection.json into Postman
- **THEN** all endpoint folders and requests appear without import errors
