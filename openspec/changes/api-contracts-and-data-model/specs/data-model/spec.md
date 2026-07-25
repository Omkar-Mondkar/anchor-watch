## ADDED Requirements

### Requirement: All 9 Mongoose models exist and are importable
`backend/src/models/index.js` SHALL export all 9 models: `Server`, `ServerProfile`, `Baseline`, `ConfigItem`, `Drift`, `Alert`, `Audit`, `AgentEnrollment`, `MonitorCard`. Running `node -e "require('./backend/src/models')"` SHALL exit 0.

#### Scenario: Backend starts and models are loaded
- **WHEN** the backend starts
- **THEN** all 9 Mongoose models are registered without errors

### Requirement: Server model schema
The `Server` model SHALL have fields: `hostname` (String, required, unique), `ip` (String, required), `environment` (String, enum: PROD/UAT/DR, required), `profileId` (ObjectId ref ServerProfile), `status` (String, enum: active/inactive/decommissioned, default: active), `enrollmentStatus` (String, enum: pending/enrolled/revoked, default: pending), `onboardedAt` (Date, default: now), `lastCheckIn` (Date). Index on `environment` and `status`.

#### Scenario: Server document is created
- **WHEN** a new Server document is saved
- **THEN** `onboardedAt` defaults to current timestamp and `enrollmentStatus` defaults to "pending"

### Requirement: ServerProfile model schema
The `ServerProfile` model SHALL have fields: `name` (String, required, unique), `description` (String), `collectorConfig` (Array of objects with `category` String and `enabled` Boolean), `defaultBaselineId` (ObjectId ref Baseline), `tags` (Array of String). Timestamps enabled.

#### Scenario: Profile is created with collector config
- **WHEN** a ServerProfile document is saved with collectorConfig entries
- **THEN** each collectorConfig item has category and enabled fields

### Requirement: Baseline model schema
The `Baseline` model SHALL have fields: `scope` (String, enum: server/profile, required), `scopeId` (ObjectId, required), `version` (String, required), `checksum` (String, required), `createdBy` (String, required), `createdAt` (Date, default: now), `approvedBy` (String). Compound index on `scope + scopeId + version` (unique).

#### Scenario: Baseline version is unique per scope
- **WHEN** two Baseline documents are saved with the same scope, scopeId, and version
- **THEN** the second save throws a duplicate key error

### Requirement: ConfigItem model schema
The `ConfigItem` model SHALL have fields: `baselineId` (ObjectId ref Baseline, required), `category` (String, required, enum: sysctl/cpu/irq/nic/ha/ntp/memory/custom_files), `parameter` (String, required), `expectedValue` (Mixed, required), `dataType` (String, enum: string/number/boolean/object). Index on `baselineId`.

#### Scenario: ConfigItem is retrieved by baseline
- **WHEN** ConfigItem.find({baselineId}) is called
- **THEN** all items for that baseline are returned

### Requirement: Drift model schema
The `Drift` model SHALL have fields: `serverId` (ObjectId ref Server, required), `category` (String, required), `parameter` (String, required), `baselineValue` (Mixed), `currentValue` (Mixed), `severity` (String, enum: INFO/WARNING/CRITICAL, required), `status` (String, enum: open/ack/resolved, default: open), `timestamp` (Date, default: now). Index on `serverId + status`.

#### Scenario: Open drift records are queried
- **WHEN** Drift.find({serverId, status: 'open'}) is called
- **THEN** only open drift records for that server are returned

### Requirement: Alert model schema
The `Alert` model SHALL have fields: `driftIds` (Array of ObjectId ref Drift, required), `channel` (String, enum: monitoring-tool/webhook/dashboard, required), `sentAt` (Date), `status` (String, enum: pending/sent/failed/resolved, default: pending). Timestamps enabled.

#### Scenario: Alert is created for drift records
- **WHEN** an Alert document is saved
- **THEN** all referenced driftIds are stored as ObjectIds

### Requirement: Audit model is append-only
The `Audit` model SHALL have fields: `user` (String, required), `action` (String, required), `entity` (String, required), `entityId` (String), `previousValue` (Mixed), `newValue` (Mixed), `timestamp` (Date, default: now). The model SHALL use Mongoose middleware to throw an error on any `findOneAndUpdate`, `updateOne`, `updateMany`, `findOneAndDelete`, `deleteOne`, or `deleteMany` call. Index on `entity + timestamp`.

#### Scenario: Audit record update is attempted
- **WHEN** Audit.updateOne({...}, {...}) is called
- **THEN** an error is thrown with message "Audit records are immutable"

#### Scenario: Audit record deletion is attempted
- **WHEN** Audit.deleteOne({...}) is called
- **THEN** an error is thrown with message "Audit records are immutable"

### Requirement: AgentEnrollment model schema
The `AgentEnrollment` model SHALL have fields: `serverId` (ObjectId ref Server, required, unique), `tokenHash` (String, required), `issuedAt` (Date, default: now), `expiresAt` (Date, required), `rotatedAt` (Date), `status` (String, enum: active/revoked/expired, default: active). Index on `tokenHash`.

#### Scenario: Enrollment token is looked up by hash
- **WHEN** AgentEnrollment.findOne({tokenHash}) is called
- **THEN** the enrollment record is found using the index

### Requirement: MonitorCard model schema
The `MonitorCard` model SHALL have fields: `label` (String, required), `monitoringId` (String, required, match: /^\d{5}$/), `serverId` (ObjectId ref Server, nullable), `category` (String, enum: sysctl/cpu/irq/nic/ha/ntp/memory/custom_files, nullable), `severityThreshold` (String, enum: INFO/WARNING/CRITICAL, default: CRITICAL), `scriptPath` (String, required), `isActive` (Boolean, default: true). Timestamps enabled.

#### Scenario: MonitorCard rejects invalid monitoring ID
- **WHEN** a MonitorCard is saved with a monitoringId that is not exactly 5 digits
- **THEN** Mongoose validation throws with a descriptive error

### Requirement: Mongoose connection is wired into the Express app
`backend/src/app.js` SHALL call `mongoose.connect(config.mongoUri)` on startup and log a success message. On connection error, the process SHALL log the error and exit with code 1.

#### Scenario: Backend starts with valid MONGO_URI
- **WHEN** the backend starts with MONGO_URI set to a reachable MongoDB instance
- **THEN** "MongoDB connected" is logged and the app continues to start

#### Scenario: Backend starts with invalid MONGO_URI
- **WHEN** the backend starts with an unreachable MONGO_URI
- **THEN** the process logs the connection error and exits with code 1

### Requirement: data-model.md documents all entities and relationships
`docs/api/data-model.md` SHALL contain: entity descriptions for all 9 models, a relationship diagram (text/ASCII), design decision explanations (append-only Audit, scope pattern in Baseline, MonitorCard structure), and index strategy for each model.

#### Scenario: Frontend developer reads data-model.md
- **WHEN** a developer reads data-model.md
- **THEN** they understand how Server relates to Baseline, Drift, Alert, and Audit without reading any Mongoose code
