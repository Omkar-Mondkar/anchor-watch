# Product Requirements Document (PRD)

# ConfigGuard
### Enterprise Configuration Baseline & Drift Detection Platform

**Version:** 1.0  
**Author:** Global Markets Infrastructure Team  
**Status:** Draft  
**Target Users:** Infrastructure Engineers, DevOps, Linux Administrators, Trading Infrastructure Teams

---

# 1. Executive Summary

ConfigGuard is a centralized configuration governance platform designed to monitor, validate, and alert on configuration drift across Linux servers.

The platform provides a "single source of truth" for critical server configurations by maintaining validated baseline snapshots for each onboarded server and continuously comparing live system state against those baselines.

The primary objective is to prevent silent configuration changes caused by:

- Operating system upgrades
- Kernel updates
- System reboots
- Driver updates
- Manual administrator changes
- Configuration corruption
- Infrastructure migrations

The system acts as a lightweight, purpose-built alternative to Git for infrastructure configuration validation, optimized for fixed configuration files and system tuning parameters.

---

# 2. Problem Statement

Infrastructure teams currently face several challenges:

### Lack of Centralized Baselines

No single repository exists that defines the approved state of a server.

### Configuration Drift

Critical tuning can unknowingly change over time.

Examples:

- sysctl values reset
- IRQ affinity changes
- NIC tuning lost
- HAProxy configuration modified
- HugePages removed
- CPU isolation parameters altered

### Limited Change Visibility

Changes are often discovered only after:

- Latency increases
- Service degradation
- Production incidents

### Operational Risk

There is no automated verification that production systems are running approved settings before business-critical operations begin.

---

# 3. Vision

Provide a centralized platform that:

- Maintains approved configuration baselines
- Detects configuration drift in near real time
- Highlights critical deviations
- Provides an audit trail of changes
- Enables pre-operational validation
- Scales across hundreds of servers

---

# 4. Goals

## Primary Goals

### G1

Maintain a version-controlled baseline for every server.

### G2

Continuously compare live configurations against approved baselines.

### G3

Provide visual diff analysis.

### G4

Alert teams when critical configurations change.

### G5

Offer a modern operational dashboard.

---

# 5. Non-Goals

The platform will NOT:

- Replace GitHub
- Replace Ansible
- Replace Puppet
- Manage application deployments
- Automatically change configurations (Phase 1)

---

# 6. Target Users

## Infrastructure Administrators

Responsible for server maintenance.

## DevOps Engineers

Responsible for configuration governance.

## Trading Infrastructure Teams

Responsible for low-latency systems.

## Operations Teams

Responsible for daily health checks.

## Auditors

Responsible for change tracking.

---

# 7. Key Business Benefits

### Configuration Governance

Single source of truth for all critical servers.

### Drift Detection

Immediate identification of configuration changes.

### Auditability

Complete history of all baseline updates.

### Operational Assurance

Pre-business validation of production systems.

### Faster Recovery

Rapid restoration using validated baselines.

---

# 8. High Level Architecture

```text
+------------------------------------------------------+
|                    React Frontend                    |
+-------------------------+----------------------------+
                          |
                          v
+------------------------------------------------------+
|                 Node.js API Layer                    |
+------------------------------------------------------+
        |                    |                    |
        v                    v                    v

+--------------+    +----------------+    +---------------+
| MongoDB      |    | Baseline Store |    | Alert Engine  |
| Metadata     |    | Git Repository |    | Email/Teams   |
+--------------+    +----------------+    +---------------+

                          ^
                          |
                          v

+------------------------------------------------------+
|           Linux Configuration Agent                  |
+------------------------------------------------------+
       |             |              |
       v             v              v
     TNSI1         TNSI2         EAGLE1
```

---

# 9. Core Components

## 9.1 Frontend

Technology:

- React
- TypeScript
- Material UI
- Tailwind CSS
- Redux Toolkit

Responsibilities:

- Dashboard
- Diff Viewer
- Alert Center
- Baseline Management
- Audit Reporting

---

## 9.2 Backend

Technology:

- Node.js
- Express
- JWT Authentication

Responsibilities:

- API Layer
- Baseline Management
- Authentication
- Alert Processing
- Diff Computation

---

## 9.3 Database

Technology:

- MongoDB

Responsibilities:

- Server Records
- Baseline Metadata
- Drift Records
- Audit Logs
- User Management

---

## 9.4 Agent

Technology:

- Python

Responsibilities:

- Collect Live Configuration
- Normalize Data
- Compare Against Baselines
- Upload Results

---

# 10. Supported Configuration Categories

## Operating System

- OS Release
- Kernel Version

## Sysctl

```bash
sysctl -a
```

Examples:

- net.core.*
- net.ipv4.*
- vm.*

---

## CPU Tuning

Examples:

- isolcpus
- nohz_full
- rcu_nocbs
- governor settings
- turbo settings

---

## Interrupt Configuration

Examples:

- IRQ Affinity
- irqbalance status

---

## NIC Configuration

Examples:

- Ring Buffers
- Interrupt Coalescing
- Driver Version
- Firmware Version
- Offloads

---

## HA Configuration

Examples:

- HAProxy
- Keepalived
- VRRP

---

## Time Synchronization

Examples:

- NTP
- Chrony
- PTP

---

## Memory

Examples:

- HugePages
- Tuned Profiles

---

## Custom Files

Examples:

```text
/etc/sysctl.conf
/etc/security/limits.conf
/etc/haproxy/haproxy.cfg
/etc/keepalived/keepalived.conf
```

---

# 11. Functional Requirements

# FR-1 Server Onboarding

Users shall be able to onboard servers.

Input:

```json
{
  "hostname": "tnsi1",
  "ip": "10.0.0.10",
  "environment": "PROD"
}
```

Output:

- Server Registered
- Agent Token Generated

---

# FR-2 Baseline Creation

Users shall capture a golden snapshot.

System shall:

1. Collect live configuration
2. Normalize data
3. Store baseline

---

# FR-3 Baseline Versioning

Every baseline update shall generate:

```json
{
  "version":"1.0.1",
  "updatedBy":"admin",
  "timestamp":"2026-07-23"
}
```

---

# FR-4 Drift Detection

System shall compare:

```text
Live State vs Baseline
```

Differences shall be stored.

---

# FR-5 Visual Diff Analyzer

Users shall view:

- Side-by-side comparison
- Inline comparison
- JSON comparison

Example:

```text
BASELINE                    CURRENT

net.core.rmem=33554432      net.core.rmem=16777216
```

---

# FR-6 Severity Classification

Each drift shall be categorized.

Levels:

```text
INFO
WARNING
CRITICAL
```

---

# FR-7 Alerting

Critical drift shall trigger:

- Email
- Microsoft Teams
- Web Dashboard Alert

---

# FR-8 Audit Trail

System shall store:

- Change Date
- User
- Change Reason
- Previous Value
- New Value

---

# FR-9 Scheduled Validation

Users shall configure schedules.

Examples:

```text
Pre-BOD
Hourly
Daily
Weekly
```

---

# FR-10 Compliance Dashboard

Show:

- Compliant Servers
- Non-Compliant Servers
- Drift Summary

---

# 12. Non-Functional Requirements

## Performance

Dashboard Load:

```text
< 3 seconds
```

Diff Calculation:

```text
< 5 seconds
```

---

## Availability

```text
99.9%
```

Target uptime.

---

## Scalability

Support:

```text
500+
Servers
```

Initial Design

---

## Security

- JWT Authentication
- Role-Based Access Control
- TLS Encryption
- Audit Logging

---

# 13. User Roles

## Admin

Permissions:

- Manage Servers
- Manage Baselines
- Configure Alerts

---

## Engineer

Permissions:

- View Reports
- Approve Baselines

---

## Auditor

Permissions:

- Read-Only Access
- Export Reports

---

# 14. UI/UX Requirements

## Theme

Dark Modern Operations Theme

Colors:

```css
Background: #0B1220
Surface:    #111827
Success:    #22C55E
Warning:    #F59E0B
Critical:   #EF4444
Accent:     #3B82F6
```

---

## Primary Screens

### Dashboard

Displays:

- Overall Health
- Server Status
- Active Drift Alerts

---

### Servers

Displays:

- All Servers
- Environment
- Compliance State

---

### Drift Analyzer

Displays:

- Live Vs Baseline
- Side-by-Side Diff
- Severity

---

### Baselines

Displays:

- Baseline Versions
- Change History

---

### Audit Logs

Displays:

- Change Timeline
- User Activity

---

### Alerts

Displays:

- Active Alerts
- Alert History

---

# 15. Database Schema

## Server

```javascript
{
  _id,
  hostname,
  ip,
  environment,
  status,
  onboardedAt
}
```

---

## Baseline

```javascript
{
  _id,
  serverId,
  version,
  checksum,
  createdBy,
  createdAt
}
```

---

## Drift

```javascript
{
  _id,
  serverId,
  parameter,
  baselineValue,
  currentValue,
  severity,
  timestamp
}
```

---

## Audit

```javascript
{
  _id,
  user,
  action,
  previousValue,
  newValue,
  timestamp
}
```

---

# 16. MERN Project Structure

```text
configguard/

├── frontend
│   ├── public
│   └── src
│       ├── pages
│       │   ├── Dashboard.jsx
│       │   ├── Servers.jsx
│       │   ├── Baselines.jsx
│       │   ├── DriftAnalyzer.jsx
│       │   ├── Alerts.jsx
│       │   └── AuditLogs.jsx
│       │
│       ├── components
│       │   ├── Sidebar.jsx
│       │   ├── Header.jsx
│       │   ├── DiffViewer.jsx
│       │   ├── HealthWidget.jsx
│       │   └── AlertCard.jsx
│       │
│       ├── services
│       └── store
│
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── routes
│   │   ├── services
│   │   ├── middleware
│   │   ├── models
│   │   └── app.js
│
├── agent
│   ├── collector.py
│   ├── normalizer.py
│   ├── comparer.py
│   └── uploader.py
│
├── baselines
│
├── docs
│
└── docker-compose.yml
```

---

# 17. Success Metrics

| Metric | Target |
|----------|---------|
| Drift Detection Accuracy | >95% |
| Critical Drift Detection | 100% |
| Dashboard Availability | 99.9% |
| Alert Delivery Success | >99% |
| Server Coverage | 100% Production Servers |

---

# 18. Roadmap

## Phase 1

MVP

- Server Onboarding
- Baseline Creation
- Drift Detection
- Dashboard
- Alerts

---

## Phase 2

Governance

- Baseline Approval Workflow
- Git Integration
- Change Requests

---

## Phase 3

Enterprise

- Auto Remediation
- Teams Integration
- ServiceNow Integration
- Jira Integration
- Compliance Reporting

---

## Phase 4

Advanced

- AI Drift Classification
- Predictive Risk Scoring
- Infrastructure Intelligence
- Environment Comparison

---

# 19. Product Vision Statement

ConfigGuard will become the centralized configuration authority for all Linux infrastructure by providing a versioned baseline, continuous validation, intelligent drift detection, and operational assurance through a modern, intuitive platform designed specifically for mission-critical environments.

Give me the complete backend/src/ files and agent/ files
along with the code files
i want an api documentation and other things that i can generate from a separate chat for frontend, this doc will act as the comprehensive coherent bridge/glue