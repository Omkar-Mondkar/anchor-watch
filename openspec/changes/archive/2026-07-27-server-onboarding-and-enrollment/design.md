## Context

To manage configuration securely across hundreds of servers without distributing static long-lived credentials, ConfigGuard uses an enrollment-based agent architecture. Admins pre-register a server to obtain a one-time enrollment token. The agent on the server uses this token to retrieve a long-lived identity token (JWT) that it will use for all subsequent interactions (fetching profiles, uploading drift).

## Goals / Non-Goals

**Goals:**
- Provide an API endpoint (`POST /api/servers`) to register a new server and return a one-time enrollment token.
- Provide an API endpoint (`POST /api/agents/enroll`) for the agent to exchange the one-time token for a JWT.
- Implement the agent-side script `enrollment.py` to handle the token exchange and store the JWT securely locally.
- Handle token expiration and validation on the backend.

**Non-Goals:**
- Full Role-Based Access Control (RBAC) across the entire application (will be handled in a separate change).
- Agent polling for drift (this change focuses solely on establishing identity/enrollment).
- Full mTLS setup for the backend in dev (we will use JWTs for now, mapping to the long-term goal of secure transport).

## Decisions

- **Token Generation**: The backend will use `crypto.randomBytes` to generate a high-entropy one-time token during server onboarding. We will store a bcrypt hash of this token in the `AgentEnrollment` model to prevent plaintext token leakage in the database.
- **Agent Identity**: Upon successful enrollment, the backend issues a standard JWT signed with `JWT_SECRET` (as configured in `.env`). The payload of this JWT will contain the `serverId`.
- **Token Storage (Agent)**: The Python agent will write the received JWT to a local file (e.g., `.agent_token`) with strict file permissions (`0600`) to ensure only the agent process can read it.
- **Enrollment Expiry**: The one-time token will have an expiration time (e.g., 24 hours). The `AgentEnrollment` schema will enforce this.

## Risks / Trade-offs

- **Risk**: Token theft from the agent host.
  - **Mitigation**: The JWT will be stored with restricted permissions (`0600`).
- **Risk**: The one-time token is intercepted during initial provisioning.
  - **Mitigation**: The API requires HTTPS. The token is single-use and short-lived.
