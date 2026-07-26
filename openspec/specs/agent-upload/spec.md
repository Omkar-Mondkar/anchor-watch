## ADDED Requirements

### Requirement: Secure Upload
The agent SHALL use its securely stored JWT to authenticate uploads to the backend.

#### Scenario: Authenticated upload
- **WHEN** the agent makes an upload request
- **THEN** it attaches the JWT as a Bearer token in the Authorization header

### Requirement: State Hashing
The agent SHALL compute an SHA-256 hash of its normalized state.

#### Scenario: Hashing state
- **WHEN** normalization is complete
- **THEN** the agent hashes the exact JSON string and includes the hash in the upload payload
