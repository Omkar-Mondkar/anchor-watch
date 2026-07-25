## ADDED Requirements

### Requirement: Backend scaffold starts and responds to health-check
The `backend/` directory SHALL contain a valid Express app. Running `node src/app.js` SHALL start the server and `GET /api/health` SHALL return HTTP 200 with `{"status":"ok","timestamp":"<ISO8601>"}`.

#### Scenario: Health-check endpoint is called
- **WHEN** a GET request is sent to /api/health
- **THEN** the response is HTTP 200 with JSON body {"status":"ok","timestamp":"<ISO string>"}

### Requirement: Backend middleware chain is configured
The Express app SHALL include: CORS (configurable allowed origins), JSON body parser, Morgan request logging, and a global error handler that returns `{"error":"<message>"}` with appropriate HTTP status.

#### Scenario: Unhandled route is requested
- **WHEN** a GET request is sent to /api/unknown-route
- **THEN** the response is HTTP 404 with {"error":"Not found"}

### Requirement: Backend configuration is env-driven
All configuration (port, Mongo URI, Redis URL, JWT secret, agent token expiry) SHALL be loaded from environment variables via a `config.js` module. The app SHALL fail fast with a descriptive error if required variables are missing at startup.

#### Scenario: Required env variable is missing
- **WHEN** JWT_SECRET is not set in the environment
- **THEN** the backend process exits immediately with a descriptive error message

### Requirement: Backend Dockerfile builds and runs correctly
The `backend/Dockerfile` SHALL use `node:20-alpine`, run `npm ci --omit=dev`, and start the app with `node src/app.js`. The dev compose override SHALL use `nodemon` for hot-reload.

#### Scenario: Backend Docker image is built
- **WHEN** `docker build -t configguard-backend ./backend` is run
- **THEN** the image builds without errors and the container responds to /api/health
