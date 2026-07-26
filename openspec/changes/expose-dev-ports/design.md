## Context

The current `docker-compose.dev.yml` setup relies on an `nginx` reverse proxy to route traffic to the frontend and backend containers. For local development, this introduces unnecessary complexity and requires accessing the application via `https://localhost` or `http://localhost`, which masks the underlying services. The goal is to simplify local development by exposing the frontend and backend services directly on `localhost:3000` and `localhost:5000`.

## Goals / Non-Goals

**Goals:**
- Make local development simpler without relying on `nginx` routing.
- Expose the frontend container on port 3000.
- Expose the backend container on port 5000.
- Ensure the frontend can still communicate with the backend successfully in this setup.

**Non-Goals:**
- Changing the production architecture (which will continue to use `nginx` as a reverse proxy).
- Removing `nginx` entirely from the repository; it will still be used in `docker-compose.yml` and `docker-compose.prod.yml`.

## Decisions

- **Expose ports in `docker-compose.dev.yml`**: We will add port mappings (`3000:3000` for `frontend` and `5000:5000` for `backend`) into `docker-compose.dev.yml` so that they override the base configuration and bind to the host.
- **Frontend API Base URL**: Since the frontend previously relied on relative paths (e.g., `/api`) resolving to the `nginx` proxy, the frontend Vite configuration or application code will need to be updated to proxy requests to `http://localhost:5000/api` during local development (Vite's dev server proxy can handle this, so the frontend code doesn't need to hardcode the port).

## Risks / Trade-offs

- **Risk**: Discrepancy between dev and prod environments (prod uses nginx, dev bypasses it).
  - **Mitigation**: This is acceptable for local development speed. Users can still test with `nginx` by running the production compose stack locally if needed.
- **Risk**: Vite proxy config needs to match nginx routing logic.
  - **Mitigation**: Ensure `vite.config.ts` proxies `/api` requests correctly to `http://backend:5000` (within docker network) or `http://localhost:5000` depending on where the dev server runs.
