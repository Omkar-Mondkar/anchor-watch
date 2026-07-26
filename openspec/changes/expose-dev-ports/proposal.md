## Why

The current development environment routes all traffic through `nginx`, requiring developers to access the application via `https://localhost` or `http://localhost`. The user finds the `nginx` setup too complex for local development and prefers directly exposing the frontend and backend services on their respective ports (e.g., `localhost:3000` for frontend and `localhost:5000` for backend) to simplify the local development workflow and debugging.

## What Changes

- Modify `docker-compose.dev.yml` to directly expose the frontend and backend container ports to the host machine.
- Expose the frontend service on `localhost:3000`.
- Expose the backend service on `localhost:5000`.
- Potentially update the frontend's API base URL in development to point directly to `http://localhost:5000` instead of relying on the relative `/api` path routed through `nginx`.
- Provide an option to bypass `nginx` entirely for local development, making `nginx` optional or removing it from the dev compose stack.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `repo-bootstrap`: The development environment configuration and Docker Compose setup is changing to expose ports directly instead of relying solely on the reverse proxy.

## Impact

- `docker-compose.dev.yml` will be updated with exposed ports.
- Frontend `.env` or Vite proxy config might need adjustment to route `/api` requests to `localhost:5000` during local development if they were previously relying on the same origin.
- `README.md` will need to be updated to instruct users to access the app via `http://localhost:3000` instead of `https://localhost` during local development.
