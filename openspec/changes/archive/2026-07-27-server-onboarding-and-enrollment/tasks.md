## 1. Backend: Server Onboarding

- [x] 1.1 Add `crypto` logic to generate a high-entropy one-time token and securely hash it using bcrypt.
- [x] 1.2 Implement the `POST /api/servers` endpoint in `backend/src/controllers/server.controller.js` to handle server registration and token generation.
- [x] 1.3 Update `backend/src/routes/server.routes.js` to mount the new endpoint.

## 2. Backend: Agent Enrollment

- [x] 2.1 Implement the `POST /api/agents/enroll` endpoint to exchange a token for a JWT.
- [x] 2.2 Add logic to verify the bcrypt hash of the provided one-time token against the `AgentEnrollment` record.
- [x] 2.3 Sign and return a JWT containing the `serverId`, and mark the one-time token as consumed/rotated.

## 3. Agent: Token Exchange

- [x] 3.1 Update `agent/enrollment.py` to accept a one-time token via CLI argument (e.g., `--enroll-token`).
- [x] 3.2 Add logic to `agent/enrollment.py` to make a `POST` request to `/api/agents/enroll` using the token.
- [x] 3.3 Add logic to save the received JWT to a local file `.agent_token` with `0600` permissions.
- [x] 3.4 Update `agent/collector.py` to read the JWT from `.agent_token` and use it as a Bearer token in subsequent API requests.
