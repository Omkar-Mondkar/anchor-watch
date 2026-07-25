## ADDED Requirements

### Requirement: Docker Compose dev stack starts all services
Running `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up` SHALL start nginx, frontend, backend, mongodb, redis, agent-mock, and mongo-express. All services SHALL reach a healthy state within 60 seconds.

#### Scenario: Developer starts the dev stack
- **WHEN** a developer runs the dev compose command
- **THEN** all seven services start and health-check endpoints respond within 60 seconds

### Requirement: Docker Compose prod stack excludes dev-only services
The `docker-compose.prod.yml` override SHALL NOT include agent-mock or mongo-express. Production services SHALL have `restart: always`, memory and CPU resource limits, and healthcheck definitions.

#### Scenario: Ops deploys to production server
- **WHEN** ops runs the prod compose command
- **THEN** only nginx, frontend, backend, mongodb, and redis start; agent-mock and mongo-express are absent

### Requirement: Services communicate over internal Docker networks
Backend, MongoDB, and Redis SHALL communicate over an internal Docker network (`backend_net`). Frontend and nginx SHALL communicate over a separate network (`frontend_net`). No internal service port SHALL be exposed to the host in production.

#### Scenario: Network isolation verified
- **WHEN** the stack is running in prod mode
- **THEN** MongoDB port 27017 and Redis port 6379 are not accessible from outside the Docker network

### Requirement: Persistent data survives container restarts
MongoDB data, Redis data, and the baseline store SHALL be persisted in named Docker volumes so that data survives `docker-compose restart`.

#### Scenario: Container is restarted
- **WHEN** the mongodb container is stopped and restarted
- **THEN** all previously written data is still accessible
