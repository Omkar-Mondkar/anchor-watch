## 1. Backend Integration

- [x] 1.1 In the backend, implement `GET /api/servers` in `server.controller.js` to return a list of servers.
- [x] 1.2 Update `server.routes.js` to mount `GET /api/servers`.

## 2. Frontend API Service

- [x] 2.1 Create `frontend/src/api/serverApi.ts` with typed functions for `getServers()` and `registerServer(data)`.

## 3. UI Components

- [x] 3.1 Create `frontend/src/pages/Servers.tsx` and implement the main layout (header, "Add Server" button).
- [x] 3.2 Implement a Material UI `Table` in `Servers.tsx` to list the servers fetched from the API.
- [x] 3.3 Create `frontend/src/components/servers/AddServerModal.tsx` containing a form (Hostname, IP, Environment dropdown).
- [x] 3.4 Wire the modal submission to `registerServer()`.
- [x] 3.5 Create `frontend/src/components/servers/TokenDisplayModal.tsx` to display the `enrollmentToken` upon successful registration.
- [x] 3.6 Update `frontend/src/App.tsx` (or your router) to ensure the `/servers` route renders the new `Servers.tsx` page.
