## ADDED Requirements

### Requirement: Admin Server Registration
The system SHALL allow an administrator to register a new server, returning a one-time enrollment token in plaintext.

#### Scenario: Successful registration
- **WHEN** an admin sends a valid `POST /api/servers` request with a hostname and profile
- **THEN** the system creates the server record, generates a one-time token, stores its hash, and returns the plaintext token

### Requirement: Enrollment Token Storage
The system SHALL NOT store the one-time enrollment token in plaintext.

#### Scenario: Token storage
- **WHEN** a one-time token is generated
- **THEN** it is immediately hashed using bcrypt and stored in the `AgentEnrollment` collection
