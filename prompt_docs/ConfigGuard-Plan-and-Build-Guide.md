# ConfigGuard — Refined Platform Plan & AI-Agent Build Guide

This document has two parts, as requested:

- **Part A — Finalized Plan**: the original PRD, refined and generalized so ConfigGuard works as a true multi-server platform rather than a fixed fleet, with an architecture built for a coding agent to implement in clean, independently-shippable slices.
- **Part B — Step-by-Step Build Guide**: how to actually build Part A from scratch using **OpenSpec** (spec-driven development layer) and **GitHub Copilot coding agent** (the implementer), including where a third tool could substitute and why it wasn't chosen as the default.

No application code is included here by design — this is the plan and the process. Part A's data-model/API-contract change (Change #1 in the roadmap) is what you hand to a separate frontend-focused chat as the "bridge" document.

---

# PART A — FINALIZED PLAN

## A1. What changed from the original PRD, and why

| Area | Original PRD | Refinement | Why |
|---|---|---|---|
| Agent | Implied one agent build watching a fixed list (TNSI1, TNSI2, EAGLE1) | Single generic agent binary, identical on every host, driven entirely by a **server profile** fetched from the API at runtime | Lets you onboard server #501 without touching agent code — the whole point of "generalized" |
| Diffing | `agent/comparer.py` does the compare | Comparison logic moves **server-side** into a diff engine; the agent only collects, normalizes, hashes, and uploads | One source of truth for severity rules and diff logic; you can fix a false-positive rule without redeploying 500 agents |
| Baselines | One baseline per server | Baselines can be defined at the **server-group/profile level** (e.g. "trading-edge-node-v3") and inherited, with per-host overrides | Onboarding 50 near-identical edge nodes shouldn't mean authoring 50 baselines by hand |
| Transport | Bidirectional arrow agent↔backend in the diagram | **Agent always initiates outbound** (push model), mTLS + short-lived token, no inbound listener on trading hosts | Matches real trading-infra security posture — these boxes usually don't accept inbound connections |
| Scale | "Support 500+ servers" stated as a goal, no mechanism | Queued ingestion, checksum short-circuit (skip upload if nothing changed), scheduled-run jitter across the fleet | Prevents 500 agents all hitting the API at the top of the hour, and avoids storing an unchanged snapshot every run |
| Audit | Standard Mongo collection | Same collection, but **append-only/immutable** by design (no update/delete route exists for audit records) | Auditors are a named user role — the log has to be tamper-evident, not just present |
| Config categories | Fixed list (sysctl, CPU, IRQ, NIC, HA, NTP, memory, custom files) | Same categories, but implemented as **pluggable collector modules** behind a registry | Phase 4 ("AI Drift Classification", new categories) shouldn't require touching the collector core |
| API | Implicit, defined only by controllers | **Contract-first**: OpenAPI 3.1 spec + JSON Schemas are a first-class deliverable, produced before backend logic | This is the artifact you hand to a separate frontend-build chat |

Everything else in the PRD — goals, non-goals, roles, UI screens, tech stack (MERN + Python agent), success metrics — is kept. This section only lists what's *different*.

## A2. Vision (refined)

ConfigGuard is a centralized, profile-driven configuration governance platform. Any Linux server — trading, market data, risk, or otherwise — can be onboarded in minutes by installing one generic agent and assigning it a profile. The platform maintains versioned baselines (per host or per fleet role), continuously detects drift, classifies severity, alerts, and keeps an immutable audit trail, scaling from a handful of servers to 500+ without per-host engineering effort.

## A3. Architecture (refined)

```text
                         +--------------------------------------+
                         |            React Frontend             |
                         |   (built separately — see Part B §8)  |
                         +-------------------+--------------------+
                                             |
                                             v
+------------------------------------------------------------------------+
|                          Node.js API Layer (Express)                    |
|  Auth/RBAC | Onboarding | Baseline Mgmt | Diff Engine | Alert Dispatch  |
+---------+-----------------+-----------------+------------------+-------+
          |                 |                 |                  |
          v                 v                 v                  v
   +-------------+  +----------------+  +--------------+  +----------------+
   |  MongoDB     |  | Ingestion      |  | Baseline     |  | Alert Engine   |
   |  (metadata,  |  | Queue          |  | Store        |  | Email / Teams  |
   |  drift, audit)| | (Redis/BullMQ) |  | (Git-backed) |  |                |
   +-------------+  +----------------+  +--------------+  +----------------+
                             ^
                             | outbound only (push), mTLS + short-lived token
                             |
          +------------------+------------------+------------------+
          v                  v                  v                  v
   +------------+     +------------+     +------------+     +------------+
   | Agent      |     | Agent      |     | Agent      |     |  ...N more |
   | (generic)  |     | (generic)  |     | (generic)  |     |  agents    |
   | host: any  |     | host: any  |     | host: any  |     |            |
   +------------+     +------------+     +------------+     +------------+
```

Key difference from the original diagram: the agent box is singular and generic — "N hosts" instead of three named servers — and the arrow direction is explicit (agent-initiated, never backend-initiated) since most trading-floor hosts won't accept inbound connections.

## A4. The generalized agent, in plain terms

1. **Enrollment (once per host).** An admin registers the host (FR-1) and gets back a one-time enrollment token. Running the agent installer with that token exchanges it for a short-lived client certificate/JWT, which the agent stores locally with restricted file permissions and rotates automatically.
2. **Profile fetch.** On startup and on each run, the agent asks the API "what should I collect and how often?" The answer is a **server profile**: which collector categories apply (sysctl, CPU tuning, IRQ, NIC, HA config, NTP, memory, custom files), file paths to watch, and the schedule.
3. **Collect → normalize → hash.** Each collector module runs, output is normalized to a canonical JSON shape, and the whole normalized snapshot is hashed.
4. **Short-circuit upload.** If the hash matches the last successfully uploaded snapshot, the agent sends a lightweight heartbeat only ("no change, still alive"). If it differs, it uploads the full normalized snapshot.
5. **Server-side diff.** The API compares the snapshot to the host's active baseline (or its profile's baseline + host overrides), classifies each difference by severity, stores drift records, and triggers alerts for CRITICAL items.

This is the mechanism that satisfies "generalized agent, multiple servers onboarded" — the agent binary never changes; only data (profile + baseline) changes per host.

## A5. Data model (refined)

Builds directly on the PRD's schema section, decomposed for real drift analysis and fleet scale:

**Server**
`_id, hostname, ip, environment (PROD/UAT/DR), profileId, status, enrollmentStatus, onboardedAt, lastCheckIn`

**ServerProfile** *(new)*
`_id, name, description, collectorConfig[], defaultBaselineId, tags[]` — e.g. a `trading-edge-node-v3` profile many hosts can share.

**Baseline**
`_id, scope ("server" | "profile"), scopeId, version, checksum, createdBy, createdAt, approvedBy` (approval field ready for the Phase 2 governance workflow)

**ConfigItem** *(new — the baseline decomposed into diffable units)*
`_id, baselineId, category, parameter, expectedValue, dataType`

**Drift**
`_id, serverId, category, parameter, baselineValue, currentValue, severity, status (open/ack/resolved), timestamp`

**Alert** *(new, explicit)*
`_id, driftIds[], channel (email/teams/dashboard), sentAt, status`

**Audit** *(append-only)*
`_id, user, action, entity, entityId, previousValue, newValue, timestamp`

**AgentEnrollment** *(new)*
`_id, serverId, tokenHash, issuedAt, expiresAt, rotatedAt, status`

## A6. Repo structure (refined)

```text
configguard/
├── openspec/                      # spec-driven-development source of truth (Part B)
│   ├── specs/
│   └── changes/
├── .github/
│   ├── copilot-instructions.md    # repo-wide agent context
│   ├── copilot-setup-steps.yml    # pre-installs deps so the agent can build/test itself
│   ├── instructions/
│   │   ├── backend.instructions.md
│   │   └── agent.instructions.md
│   └── workflows/                 # CI: lint + test gate on every PR, incl. agent's own PRs
├── docs/
│   └── api/
│       ├── openapi.yaml           # <-- the bridge/glue doc for the frontend chat
│       ├── data-model.md
│       └── postman_collection.json
├── backend/
│   └── src/
│       ├── controllers/  routes/  services/  middleware/  models/  app.js
├── agent/
│   ├── collectors/                # plugin registry: sysctl.py, cpu.py, irq.py, nic.py, ha.py, ntp.py, memory.py, custom_files.py
│   ├── collector.py
│   ├── normalizer.py
│   ├── enrollment.py              # mTLS/token handling
│   └── uploader.py                # (no comparer.py — diffing is server-side now)
├── baselines/
├── docs/
└── docker-compose.yml
```

## A7. Functional requirements (kept, plus generalization additions)

FR-1 through FR-10 are unchanged from the original PRD in intent. Additions:

- **FR-11 Server Profiles** — Users shall define reusable profiles (collector config + default baseline) and assign a profile to a server at onboarding time.
- **FR-12 Fleet-Wide Baseline Templates** — A baseline can target a profile (applies to every server on that profile) with optional per-host overrides, rather than requiring one baseline per host.
- **FR-13 Pluggable Collectors** — New configuration categories shall be addable as a self-contained collector module without modifying the agent core.
- **FR-14 Agent Self-Enrollment** — A server shall be able to complete enrollment using a one-time token, receiving a rotating credential with no manual certificate handling.

## A8. Non-functional requirements (refined)

Keeps the PRD's targets (<3s dashboard load, <5s diff calc, 99.9% uptime, 500+ servers) and adds the mechanisms that actually make 500+ achievable:

- **Ingestion queue** (e.g. Redis/BullMQ) between agent uploads and Mongo writes, so a synchronized top-of-hour run from hundreds of agents doesn't blocking-write the DB directly.
- **Scheduled-run jitter** — each agent's cron offset is randomized within its window so 500 hosts don't all call home in the same second.
- **Checksum short-circuit** — heartbeat-only uploads when nothing changed, cutting payload volume dramatically on steady-state fleets.
- **Audit immutability** — no update/delete endpoint for the audit collection; corrections are new entries, never edits.
- **Secrets** — agent tokens and any credentials live in a secrets manager (e.g. Vault/cloud KMS), never as plaintext fields in MongoDB.
- **RBAC is environment-scoped** — an Engineer role for UAT doesn't imply write access to PROD.

## A9. Roadmap as build order

This is the same Phase 1→4 roadmap from the PRD, but decomposed into the exact sequence you'll hand to the coding agent in Part B. Each row is one **OpenSpec change**.

| # | Change name | Delivers | Maps to |
|---|---|---|---|
| 0 | `repo-bootstrap` | Monorepo scaffold, lint/test CI, docker-compose skeleton | Foundation |
| 1 | `api-contracts-and-data-model` | OpenAPI 3.1 spec, JSON Schemas, Mongo models for all entities in A5 | **The bridge doc** — hand to frontend chat |
| 2 | `auth-and-rbac` | JWT auth, Admin/Engineer/Auditor roles, environment scoping | §13, NFR Security |
| 3 | `server-onboarding-and-enrollment` | FR-1, FR-14 — onboarding + one-time-token enrollment | FR-1, FR-14 |
| 4 | `agent-collector-framework` | Generic push agent, plugin collector registry, normalizer, checksum uploader | §10 categories, FR-13 |
| 5 | `baseline-management` | FR-2, FR-3, FR-11, FR-12 — baselines at server or profile scope | FR-2, FR-3, FR-11, FR-12 |
| 6 | `drift-detection-engine` | FR-4 — server-side diff engine at ConfigItem granularity | FR-4 |
| 7 | `diff-query-api` | FR-5 — side-by-side/inline/JSON diff endpoints (data only, no UI) | FR-5 |
| 8 | `severity-and-alerting` | FR-6, FR-7 — severity rules + email/Teams dispatch | FR-6, FR-7 |
| 9 | `audit-trail` | FR-8 — immutable audit log | FR-8 |
| 10 | `scheduled-validation` | FR-9 — Pre-BOD/hourly/daily/weekly schedules, run jitter | FR-9 |
| 11 | `compliance-dashboard-api` | FR-10 — aggregate compliance endpoints | FR-10 |
| 12 | `hardening-and-scale` | Ingestion queue, rate limiting, retention policy, 500-agent load test | NFR Scalability |

Changes 0–11 are Phase 1 (MVP). Change 12 closes out Phase 1 by proving the scale target. Phases 2–4 from the original PRD (approval workflow, Git integration, auto-remediation, AI classification) become additional changes appended to this same list later, using the identical loop from Part B.

## A10. Success metrics (kept, plus one)

Same five metrics as the original PRD (drift detection accuracy >95%, critical drift detection 100%, dashboard availability 99.9%, alert delivery >99%, 100% production server coverage), plus:

- **Time to onboard a new server:** < 15 minutes from "run installer" to "first baseline compared" — the metric that actually proves the generalized-agent goal was met.

## A11. The bridge document, explicitly

The deliverable from Change #1 (`api-contracts-and-data-model`) is `docs/api/openapi.yaml` plus `docs/api/data-model.md`. That pair is what you paste into (or link for) a separate frontend-build chat. It fully describes every endpoint, request/response shape, and entity — enough for that chat to build the React frontend against a contract, without needing the backend source code as context.

---

# PART B — STEP-BY-STEP BUILD GUIDE

## B0. Tool choice and why

You asked specifically about GitHub Copilot coding agent plus "OpenSpec or others." Here's the landscape as it stands today:

| Tool | What it is | Verdict for this project |
|---|---|---|
| **OpenSpec** | A lightweight spec layer: `propose → apply → archive`. Generates a proposal, spec deltas, a design doc, and a task checklist per change; specs live in-repo as the running source of truth. Works with 20+ AI tools including GitHub Copilot, via slash commands. No API keys, no rigid phase gates. | **Recommended default.** Fast setup, explicitly built for brownfield/enterprise scale, and its "one change = one folder" model maps cleanly onto the roadmap in A9. |
| **GitHub Spec Kit** | GitHub's own open-source spec-driven toolkit. More ceremony: rigid phase gates, heavier Markdown output, Python-based setup. Also works with Copilot, Claude Code, Gemini CLI. | A reasonable alternative if your team wants stricter, more auditable phase gates than OpenSpec's fluid model — worth considering given this is a regulated trading-infra context. Slower to set up. |
| **GitHub Copilot coding agent** | The implementer. Assign it a well-scoped GitHub Issue and it works asynchronously in an isolated, GitHub Actions-powered sandbox, then opens a draft PR for review. Requires Copilot Pro, Pro+, Business, or Enterprise (not the free tier). | **Recommended implementer**, as you asked. Pairs naturally with either spec tool above — OpenSpec/Spec Kit produce the spec + task list; Copilot coding agent turns tasks into PRs. |

The rest of this guide assumes **OpenSpec + GitHub Copilot coding agent**. Where Spec Kit would differ, it's noted inline.

## B1. Prerequisites (one-time)

- A GitHub repo for `configguard`, with a Copilot plan that includes coding agent (Pro/Pro+/Business/Enterprise).
- Node.js ≥ 20.19.0 locally (needed for the OpenSpec CLI; your backend can target a different Node version — set that in `copilot-setup-steps.yml`, see B3).
- `gh` (GitHub CLI), logged in, for fast issue creation.
- Decide who has merge rights on `main` and turn on branch protection now (required reviews + required status checks) — do this before the agent opens its first PR, not after.

## B2. Bootstrap the repo

1. Create the empty repo, add a minimal `README.md` and `.gitignore`, push.
2. Install OpenSpec globally and initialize it in the repo:
   ```
   npm install -g @fission-ai/openspec@latest
   cd configguard
   openspec init
   ```
   This creates the `openspec/` directory and registers slash commands for your AI tool.
3. If you want the fuller command set (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`) instead of the minimal default, select it with `openspec config profile`, then run `openspec update`.

## B3. Give Copilot coding agent context before it writes anything

This step matters more than any other single thing for output quality — an under-informed agent wastes cycles rediscovering your stack by trial and error.

1. **`.github/copilot-instructions.md`** — project overview, that it's a MERN + Python-agent monorepo, how to build/test each part (backend, agent), coding conventions, and a pointer to `openspec/specs/` as the source of truth for requirements. Keep it to roughly two pages; Copilot reads this on every task, including chat and code review, not just coding-agent runs.
2. **`.github/copilot-setup-steps.yml`** — pre-installs everything the agent's sandbox needs: the pinned Node version, `npm ci` for the backend, the pinned Python version, `pip install -r requirements.txt` for the agent, and a build/test command for each. A reliable setup here is what lets the agent validate its own changes before opening a PR, instead of guessing.
3. **`.github/instructions/backend.instructions.md`** and **`.../agent.instructions.md`** (path-scoped via `applyTo` glob patterns) — narrower conventions specific to each half of the monorepo, so instructions don't bleed across contexts.
4. Optional, and worth doing once you're past Change 0: ask Copilot itself to draft `copilot-instructions.md` for you — the first time you assign it a task in a repo without one, it will offer to generate one from a scan of the codebase.

## B4. The repeatable loop (one pass per row in the A9 table)

Run this loop once per change, in the order given in A9. Each pass is small enough to review properly — that's the point of decomposing the roadmap this way.

1. **Propose.** In your editor with Copilot Chat (or any OpenSpec-supported assistant), run:
   ```
   /opsx:propose <change-name>
   ```
   e.g. `/opsx:propose api-contracts-and-data-model`. This creates `openspec/changes/<change-name>/` containing `proposal.md`, `specs/`, `design.md`, and `tasks.md`.
2. **Human review gate.** Read `proposal.md` and `design.md` yourself. This is where you catch a wrong technical approach *before* code exists — edit these files directly if the agent's first pass misses something from Part A (e.g., remind it that diffing is server-side, not agent-side, if it drafted otherwise).
3. **Turn it into a GitHub Issue.** Create one issue per change (or per logical task group inside a large change), with the acceptance criteria pulled from `tasks.md`, and a link to the `openspec/changes/<change-name>/` folder so Copilot has the design doc as context. `gh issue create` works fine for this.
4. **Assign it to Copilot.** Either:
   - In the Issues UI, set the assignee to **Copilot** (same picker as assigning a human), or
   - At github.com/copilot, type a natural-language prompt ending in "Assign this issue to Copilot."
5. **Let it work.** Copilot coding agent runs asynchronously in its own sandboxed, Actions-powered environment — builds, edits, runs your tests/lints from `copilot-setup-steps.yml` — then opens a draft PR and requests your review.
6. **Review and iterate.** Read the PR against `openspec/changes/<change-name>/tasks.md` and `specs/`. To ask for changes, comment on the PR mentioning `@copilot` with the specific revision — it reads PR comments and pushes a follow-up commit.
7. **Merge**, with required CI checks green and at least one human approval.
8. **Apply/archive.** Run `/opsx:apply` to have the assistant reconcile the merged code against the change, then `/opsx:archive` to move the change into `openspec/changes/archive/` and fold its spec deltas into `openspec/specs/` — the living source of truth for the *next* change to build on.

## B5. Execution order

Run the loop in B4 once for each row of the table in **A9**, top to bottom — most rows depend on the ones above them (e.g. you can't build `drift-detection-engine` before `baseline-management` and `agent-collector-framework` both exist).

## B6. Guardrails for a trading-infra repo specifically

- **Branch protection on `main`**: required PR review + required passing status checks (lint, unit tests, OpenAPI schema validation) before merge — including for the agent's own PRs. Never enable auto-merge for this repo.
- **No real credentials in the agent's sandbox.** Copilot's ephemeral environment should only ever see mock fixtures/test config, never real production SSH keys, mTLS certs, or Vault tokens. It's building the platform, not touching live trading hosts.
- **Secret scanning enabled** on the repo, so an accidentally-hardcoded token in a generated file gets caught before merge.
- **Keep changes small.** A change that touches both `backend/` and `agent/` in the same pass is harder to review and more likely to conflict with a parallel change — prefer the granular breakdown in A9 over collapsing rows together.

## B7. Parallelizing safely

Because Copilot coding agent runs in isolated sandboxes, you can have more than one change in flight — e.g. `agent-collector-framework` (Change 4) and `auth-and-rbac` (Change 2) touch non-overlapping code and can run concurrently. Avoid parallelizing changes that touch the same files (e.g. `baseline-management` and `drift-detection-engine` both touch the diff surface) — run those sequentially per B5.

## B8. Handoff to the frontend chat

Once Change 1 (`api-contracts-and-data-model`) is merged:

1. Grab `docs/api/openapi.yaml` and `docs/api/data-model.md` from `main`.
2. Open a new chat dedicated to the frontend, paste or link those two files, and describe the screens from the original PRD (§14 — Dashboard, Servers, Drift Analyzer, Baselines, Audit Logs, Alerts) plus the dark-theme tokens already specified there.
3. That chat can build the React frontend entirely against the contract, independent of the backend/agent build happening here — which is exactly the "coherent bridge" role you wanted this document to play.

## B9. After Phase 1

Phases 2–4 from the original PRD (baseline approval workflow, Git integration, auto-remediation, AI drift classification, and so on) are just additional rows appended to the A9 table, each run through the identical B4 loop. Nothing about the process changes — only the number of changes in the queue.

## B10. Command cheat-sheet

```
# OpenSpec setup (once)
npm install -g @fission-ai/openspec@latest
cd configguard && openspec init

# per change
/opsx:propose <change-name>      # generates proposal/specs/design/tasks
#  ... human reviews proposal.md + design.md ...
gh issue create --title "..." --body "..."   # reference the change folder
#  ... assign to Copilot via UI or "Assign this issue to Copilot." at github.com/copilot ...
#  ... review PR, comment "@copilot <revision request>" as needed ...
#  ... merge ...
/opsx:apply
/opsx:archive
```
