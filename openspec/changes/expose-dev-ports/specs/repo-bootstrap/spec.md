## ADDED Requirements

### Requirement: Expose Local Dev Ports
The system SHALL expose the frontend service directly on host port `3000` and the backend service directly on host port `5000` when running the development Docker Compose stack, bypassing `nginx` routing.

#### Scenario: Developer access
- **WHEN** a developer starts the application using `docker-compose.dev.yml`
- **THEN** they can access the frontend at `http://localhost:3000` and the backend at `http://localhost:5000`

### Requirement: Frontend Dev Server API Proxying
The frontend development server SHALL route API requests (e.g., to `/api`) to the backend service.

#### Scenario: API call in development
- **WHEN** the frontend makes an API request to `/api/health`
- **THEN** the request is successfully proxied to the backend container
