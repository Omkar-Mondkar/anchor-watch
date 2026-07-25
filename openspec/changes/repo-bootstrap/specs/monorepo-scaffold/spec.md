## ADDED Requirements

### Requirement: Top-level monorepo structure exists
The repository SHALL contain the following top-level directories: `frontend/`, `backend/`, `agent/`, `nginx/`, `docs/`, `scripts/`, `openspec/`. A `README.md` and `.env.example` SHALL exist at the repository root.

#### Scenario: Developer clones the repo
- **WHEN** a developer clones the configguard repository
- **THEN** all six top-level directories are present and a README.md and .env.example exist at the root

### Requirement: .env.example documents all required variables
The `.env.example` file SHALL list every environment variable required to run the full stack, with placeholder values and inline comments. No real secrets SHALL appear in this file.

#### Scenario: New developer sets up the project
- **WHEN** a developer copies `.env.example` to `.env` and fills in values
- **THEN** the complete docker-compose stack starts without missing-variable errors

### Requirement: README provides getting-started instructions
The `README.md` SHALL document: project overview, prerequisites, how to copy `.env.example`, how to start the dev stack, how to start the prod stack, and a reference table of all environment variables.

#### Scenario: New team member onboards
- **WHEN** a new team member reads the README
- **THEN** they can start the dev stack without needing additional guidance
