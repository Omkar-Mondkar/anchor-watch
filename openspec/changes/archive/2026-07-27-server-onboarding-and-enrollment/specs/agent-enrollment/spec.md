## ADDED Requirements

### Requirement: Agent Token Exchange
The system SHALL allow an agent to exchange a valid one-time enrollment token for a long-lived JWT.

#### Scenario: Valid token exchange
- **WHEN** an agent sends a `POST /api/agents/enroll` request with a valid `serverId` and `token`
- **THEN** the system issues a JWT and marks the one-time token as consumed

#### Scenario: Invalid token exchange
- **WHEN** an agent sends an invalid or expired token
- **THEN** the system rejects the request with a 401 Unauthorized

### Requirement: Agent Token Storage
The agent script SHALL securely store the received JWT.

#### Scenario: JWT storage on host
- **WHEN** the agent successfully receives a JWT
- **THEN** it writes the token to `.agent_token` and sets file permissions to `0600`
