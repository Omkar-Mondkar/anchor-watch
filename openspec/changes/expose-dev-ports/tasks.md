## 1. Update Development Docker Compose

- [x] 1.1 Edit `docker-compose.dev.yml` to expose port `3000:3000` on the `frontend` service
- [x] 1.2 Edit `docker-compose.dev.yml` to expose port `5000:5000` on the `backend` service

## 2. Update Frontend Configuration

- [x] 2.1 Update `frontend/vite.config.ts` to configure the dev server proxy to route `/api` to `http://backend:5000` (or `localhost:5000` if necessary depending on the docker network mapping)

## 3. Update Documentation

- [x] 3.1 Update `README.md` to instruct developers to access the application via `http://localhost:3000` for the frontend and `http://localhost:5000` for the backend APIs when running the dev compose stack.
