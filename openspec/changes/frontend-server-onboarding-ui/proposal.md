## Why

We recently implemented the backend API (`POST /api/servers`) to register a new server and generate a one-time enrollment token. We need a frontend interface for administrators to actually trigger this process, view the onboarded servers, and copy the enrollment token to run on their physical hosts.

## What Changes

- Add a "Servers" data table on the `/servers` route to list all registered servers.
- Add an "Add Server" modal to the Servers page containing a form (Hostname, IP, Environment).
- Connect the form to the `POST /api/servers` endpoint.
- Add a success modal/dialog that displays the generated `enrollmentToken` so the admin can copy it.
- **BREAKING**: None.

## Capabilities

### New Capabilities
- `server-onboarding-ui`: The frontend interface for listing servers and onboarding new ones, interacting with the existing backend endpoints.

### Modified Capabilities
None

## Impact

- Frontend application (`frontend/src/pages/Servers.tsx`, `frontend/src/components/`, `frontend/src/api/`).
- Will require adding the `axios` or native `fetch` service logic for `/api/servers`.
