## ADDED Requirements

### Requirement: Frontend scaffold builds successfully
The `frontend/` directory SHALL contain a valid Vite + React 18 + TypeScript project. Running `npm install && npm run build` SHALL produce a `/dist` directory without errors.

#### Scenario: CI builds the frontend
- **WHEN** CI runs `npm install && npm run build` in the frontend directory
- **THEN** the build completes without errors and produces a /dist directory

### Requirement: Frontend Dockerfile produces a static-only image
The `frontend/Dockerfile` SHALL use a multi-stage build: stage 1 builds the Vite bundle using `node:20-alpine`; stage 2 copies `/dist` into `nginx:alpine`. The final image SHALL contain no Node.js runtime.

#### Scenario: Production frontend image is inspected
- **WHEN** the frontend Docker image is built and inspected
- **THEN** no node or npm binary exists in the final image

### Requirement: Frontend renders placeholder in browser
The scaffold SHALL include route stubs for all six pages: Dashboard, Servers, Baselines, DriftAnalyzer, Alerts, AuditLogs. Each route SHALL render a page-name heading without errors.

#### Scenario: Developer opens the app in a browser
- **WHEN** a developer navigates to http://localhost in the dev stack
- **THEN** the application loads and displays the Dashboard placeholder without console errors

### Requirement: Frontend dependencies include required corporate-approved packages
`package.json` SHALL include: `@mui/material` (v5), `@mui/icons-material` (v5), `@emotion/react`, `@emotion/styled`, `tailwindcss` (v3), `@reduxjs/toolkit`, `react-redux`, `axios`, `react-router-dom`, `recharts`, `react-diff-viewer-continued`.

#### Scenario: Dependency install succeeds
- **WHEN** `npm install` is run in the frontend directory
- **THEN** all packages install without peer-dependency conflicts
