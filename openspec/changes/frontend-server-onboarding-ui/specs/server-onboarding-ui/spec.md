## ADDED Requirements

### Requirement: Server Listing
The UI SHALL display a list of all onboarded servers on the `/servers` route.

#### Scenario: Viewing servers
- **WHEN** an admin navigates to the Servers page
- **THEN** they see a data table showing hostname, IP, environment, and enrollment status

### Requirement: Server Onboarding Form
The UI SHALL provide a form to register a new server.

#### Scenario: Submitting the onboarding form
- **WHEN** an admin fills out the Add Server form and submits it
- **THEN** the UI sends a `POST /api/servers` request and displays the resulting one-time enrollment token in a copyable text field
