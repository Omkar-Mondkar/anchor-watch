# ConfigGuard Data Model

## Overview

ConfigGuard uses 9 MongoDB collections. This document describes every entity,
its relationships, design decisions, and index strategy.

---

## Entity Relationship Summary

```
ServerProfile ──────────────────────┐
      │ (profileId)                  │ (defaultBaselineId)
      ▼                              │
    Server ──── AgentEnrollment      ▼
      │                          Baseline ──── ConfigItem
      │ (serverId)               (scopeId)
      ▼
    Drift ──── Alert
      │           │ (monitoringId)
      ▼           ▼
    Audit     MonitorCard
```

**Read as:**
- A `Server` belongs to an optional `ServerProfile`
- A `Server` has zero or one `AgentEnrollment` (active credential)
- A `Baseline` applies to a `Server` or a `ServerProfile` (via `scope`/`scopeId`)
- A `Baseline` contains many `ConfigItems` (one per parameter)
- A `Drift` belongs to a `Server` and records a deviation from baseline
- An `Alert` references one or more `Drift` records and is dispatched to a channel
- A `MonitorCard` maps a server+category to a 5-digit corporate monitoring tool ID
- `Audit` records every significant change (append-only, no FK — stores entity name + ID as strings)

---

## Entities

### 1. Server

Represents a Linux host onboarded into ConfigGuard.

| Field | Type | Notes |
|---|---|---|
| `hostname` | String | Unique. Human-readable server name (e.g. TNSI1) |
| `ip` | String | Management IP address |
| `environment` | String enum | PROD / UAT / DR |
| `profileId` | ObjectId → ServerProfile | Optional fleet profile assignment |
| `status` | String enum | active / inactive / decommissioned |
| `enrollmentStatus` | String enum | pending / enrolled / revoked |
| `onboardedAt` | Date | Auto-set to `now` on create |
| `lastCheckIn` | Date | Updated by agent heartbeat or upload |

**Indexes:** `hostname` (unique), `environment`, `status`, `profileId`

---

### 2. ServerProfile

A reusable configuration profile shared across a group of near-identical servers.
For example, all 50 trading-edge nodes run the same kernel profile.

| Field | Type | Notes |
|---|---|---|
| `name` | String | Unique. Profile identifier |
| `description` | String | Human-readable description |
| `collectorConfig` | Array of sub-docs | Which collector categories are enabled + watchPaths for custom_files |
| `defaultBaselineId` | ObjectId → Baseline | Optional default baseline for profile members |
| `tags` | String[] | Free-form labels |

**Indexes:** `name` (unique)

---

### 3. Baseline

A versioned, approved snapshot of expected configuration values.

**Design decision — `scope` + `scopeId` pattern:**

Instead of a direct `serverId` foreign key, `Baseline` uses two fields:
- `scope: "server" | "profile"` — which entity type this baseline applies to
- `scopeId: ObjectId` — the ID of that entity

This allows one baseline to cover an entire fleet of 50 servers sharing a `ServerProfile`,
without duplicating 50 baseline records. The drift engine resolves the effective baseline by:
1. Looking for a `server`-scope baseline for the specific server
2. Falling back to the `profile`-scope baseline for the server's profile

| Field | Type | Notes |
|---|---|---|
| `scope` | String enum | server / profile |
| `scopeId` | ObjectId | ID of a Server or ServerProfile |
| `version` | String | Semantic version (e.g. 1.0.3) |
| `checksum` | String | SHA-256 of the full normalized snapshot |
| `createdBy` | String | Username |
| `approvedBy` | String | Set by Engineer/Admin role |
| `approvedAt` | Date | When approval was granted |

**Indexes:** Compound unique (`scope`, `scopeId`, `version`), `scopeId`

---

### 4. ConfigItem

A single diffable configuration parameter that belongs to a baseline.
The drift engine compares a server's live ConfigItems against these baseline values.

| Field | Type | Notes |
|---|---|---|
| `baselineId` | ObjectId → Baseline | Parent baseline |
| `category` | String enum | sysctl / cpu / irq / nic / ha / ntp / memory / custom_files |
| `parameter` | String | Parameter name (e.g. `net.core.rmem_max`) |
| `expectedValue` | Mixed | Baseline value — can be string, number, boolean, or object |
| `dataType` | String enum | string / number / boolean / object |

**Indexes:** `baselineId`, compound (`baselineId`, `category`, `parameter`)

---

### 5. Drift

A detected deviation between a live server state and its approved baseline.
Created by the server-side diff engine (Change 6).

| Field | Type | Notes |
|---|---|---|
| `serverId` | ObjectId → Server | Which server drifted |
| `category` | String enum | Which collector category |
| `parameter` | String | Which parameter |
| `baselineValue` | Mixed | Expected value |
| `currentValue` | Mixed | Observed live value |
| `severity` | String enum | INFO / WARNING / CRITICAL |
| `status` | String enum | open / ack / resolved |
| `acknowledgedBy` | String | Username of engineer who acknowledged |
| `timestamp` | Date | When the drift was first detected |

**Indexes:** `serverId + status` (primary query pattern), `serverId + timestamp`, `severity + status`

---

### 6. Alert

Records a dispatch event to a notification channel triggered by drift detection.

| Field | Type | Notes |
|---|---|---|
| `driftIds` | ObjectId[] → Drift | The drift records that triggered this alert |
| `channel` | String enum | monitoring-tool / webhook / dashboard |
| `monitoringId` | String | 5-digit monitoring card ID (when channel is monitoring-tool) |
| `sentAt` | Date | When the signal was dispatched |
| `status` | String enum | pending / sent / failed / resolved |
| `failureReason` | String | Error message if dispatch failed |

**Indexes:** `status`, `createdAt` (descending)

---

### 7. Audit

Immutable, append-only change log. Records every significant system action.

**Design decision — append-only enforcement:**

Immutability is enforced at the Mongoose schema level via `pre` middleware hooks that
throw an error on any `update*` or `delete*` operation. This means even a compromised
admin token cannot alter audit history — it must be violated at the MongoDB driver level
to bypass this protection. Future hardening: dedicated auditor replica set with
read-only MongoDB role.

| Field | Type | Notes |
|---|---|---|
| `user` | String | Username who performed the action |
| `action` | String | Action code (e.g. `BASELINE_APPROVED`, `DRIFT_ACKNOWLEDGED`) |
| `entity` | String | Entity type name (e.g. `Baseline`, `Server`) |
| `entityId` | String | Entity ID (stored as string to avoid ObjectId coupling) |
| `previousValue` | Mixed | State before change |
| `newValue` | Mixed | State after change |
| `timestamp` | Date | When the event occurred |
| `ipAddress` | String | Requester IP if available |

**No `timestamps` option** — we own the `timestamp` field explicitly for auditability.

**Indexes:** `entity + timestamp`, `user + timestamp`, `entityId + timestamp`

---

### 8. AgentEnrollment

Tracks the lifecycle of an agent's credential for a single server.
One record per server. The token is never stored in plaintext.

| Field | Type | Notes |
|---|---|---|
| `serverId` | ObjectId → Server | Unique (one enrollment per server) |
| `tokenHash` | String | SHA-256 hash of the enrollment token |
| `issuedAt` | Date | When the token was issued |
| `expiresAt` | Date | TTL index — document auto-expires with the token |
| `rotatedAt` | Date | Last rotation timestamp |
| `status` | String enum | active / revoked / expired |

**Indexes:** `serverId` (unique), `tokenHash`, `expiresAt` (TTL index: `expireAfterSeconds: 0`)

---

### 9. MonitorCard

Maps a drift scope (server + optional category) to a 5-digit corporate monitoring tool card.

**How the monitoring tool integration works:**

1. Drift detected → alert engine looks up the most-specific matching `MonitorCard`
2. `monitoringId` (5-digit) is passed as an argument to the `error_signal_sending` bash script
3. The script sends the signal to the corporate monitoring tool
4. An `Alert` record is created with `channel: "monitoring-tool"` and `status: "sent"` or `"failed"`

**Scope resolution (most-specific wins):**
1. Card with matching `serverId` AND matching `category` → highest priority
2. Card with matching `serverId` AND null `category` → server-wide fallback
3. Card with null `serverId` AND null `category` → fleet-wide fallback

| Field | Type | Notes |
|---|---|---|
| `label` | String | Human-readable card label |
| `monitoringId` | String | Exactly 5 digits — validated by regex `/^\d{5}$/` |
| `serverId` | ObjectId → Server | Optional: scope to specific server |
| `category` | String enum | Optional: scope to specific collector category |
| `severityThreshold` | String enum | Minimum severity to trigger (INFO/WARNING/CRITICAL, default CRITICAL) |
| `scriptPath` | String | Absolute path to `error_signal_sending` inside the backend container |
| `isActive` | Boolean | Inactive cards are not matched |

**Indexes:** `monitoringId`, `serverId`, `isActive`

---

## Index Strategy Summary

| Collection | Key Indexes |
|---|---|
| servers | `hostname` (unique), `environment`, `status` |
| serverprofiles | `name` (unique) |
| baselines | `(scope, scopeId, version)` (compound unique), `scopeId` |
| configitems | `baselineId`, `(baselineId, category, parameter)` |
| drifts | `(serverId, status)`, `(serverId, timestamp)`, `(severity, status)` |
| alerts | `status`, `createdAt` |
| audits | `(entity, timestamp)`, `(user, timestamp)`, `(entityId, timestamp)` |
| agentenrollments | `serverId` (unique), `tokenHash`, `expiresAt` (TTL) |
| monitorcards | `monitoringId`, `serverId`, `isActive` |
