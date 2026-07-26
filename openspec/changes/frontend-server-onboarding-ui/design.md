## Context

The backend onboarding endpoint returns a one-time `enrollmentToken` that is never stored in plaintext and cannot be retrieved again. The UI must clearly display this to the user immediately after creation.

## Goals / Non-Goals

**Goals:**
- Build a responsive data table in React using Material UI.
- Build a modal for the Add Server form.
- Provide a clear, copyable display for the enrollment token.
- Use the recently established `light`/`dark` mode theme correctly (using `theme.palette` instead of hardcoded hex values).

**Non-Goals:**
- Real-time websocket updates for server status (polling or manual refresh is fine for this phase).
- Pagination for the servers table (we'll start with a simple list; we can add pagination when we implement the scale/hardening change).

## Decisions

- **State Management**: We will use React's `useState` and `useEffect` for data fetching initially. We can adopt React Query or Redux later if state becomes overly complex, but standard hooks are sufficient for this slice.
- **UI Components**: We will heavily rely on Material UI (`@mui/material` v5) components like `Table`, `Dialog`, `TextField`, and `Button` to ensure visual consistency with the theme engine we refactored earlier.
- **Proxy**: The frontend Vite server is already configured to proxy `/api` requests to the backend (`http://backend:5000`), so `fetch('/api/servers')` will work out of the box in the Docker environment.

## Risks / Trade-offs

- **Risk**: The user closes the success modal before copying the token.
  - **Mitigation**: Add a warning text in the modal: "Please copy this token now. You will not be able to see it again."
