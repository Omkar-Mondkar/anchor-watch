## Why

ConfigGuard needs a secure and scalable way to onboard new servers into the fleet. Manually distributing long-lived credentials to hundreds of servers is error-prone and insecure. We need a mechanism where an admin can register a server and receive a one-time enrollment token, which the generalized agent can then use to securely authenticate itself and exchange for a short-lived, rotatable token.

## What Changes

- Add backend API routes for server onboarding (`POST /api/servers`).
- Add backend API routes for agent enrollment (`POST /api/agents/enroll`).
- Implement the `AgentEnrollment` logic (token generation, hashing, expiration, and exchange).
- Introduce a mechanism for the generic agent to use the one-time token to authenticate itself and fetch its profile.

## Capabilities

### New Capabilities
- `server-onboarding`: Covers the admin flow of registering a new server and generating a one-time enrollment token.
- `agent-enrollment`: Covers the agent flow of exchanging the one-time token for a short-lived session token (JWT) used for subsequent API calls.

### Modified Capabilities
None

## Impact

- Backend API (`backend/src/routes/`, `backend/src/controllers/`, `backend/src/services/`).
- Python Agent (`agent/enrollment.py`).
- Security architecture (introducing one-time tokens and JWTs for agent authentication).
