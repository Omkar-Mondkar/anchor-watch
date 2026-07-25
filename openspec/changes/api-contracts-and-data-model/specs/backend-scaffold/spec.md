## MODIFIED Requirements

### Requirement: Backend scaffold starts and responds to health-check
The `backend/src/app.js` SHALL call `mongoose.connect(config.mongoUri)` on startup before binding the HTTP server. The health-check route (`GET /api/health`) SHALL remain available and return HTTP 200 `{"status":"ok","timestamp":"<ISO>"}`. On MongoDB connection failure, the process SHALL log the error and exit with code 1.

#### Scenario: Health-check endpoint is called with MongoDB connected
- **WHEN** a GET request is sent to /api/health and MongoDB is connected
- **THEN** the response is HTTP 200 with JSON body {"status":"ok","timestamp":"<ISO string>"}

#### Scenario: Backend starts with invalid MONGO_URI
- **WHEN** the backend starts with an unreachable MONGO_URI
- **THEN** the process logs the connection error and exits with code 1

#### Scenario: Unhandled route is requested
- **WHEN** a GET request is sent to /api/unknown-route
- **THEN** the response is HTTP 404 with {"error":"Not found"}

#### Scenario: Required env variable is missing
- **WHEN** JWT_SECRET is not set in the environment
- **THEN** the backend process exits immediately with a descriptive error message

#### Scenario: Backend Docker image is built
- **WHEN** `docker build -t configguard-backend ./backend` is run
- **THEN** the image builds without errors and the container responds to /api/health
