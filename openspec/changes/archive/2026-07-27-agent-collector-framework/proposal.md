## Why

The core functionality of ConfigGuard is to detect configuration drift across a fleet of Linux servers. To do this, the generalized Python agent needs a pluggable framework to gather system configurations (like sysctl, CPU, networking, etc.), normalize them into a standard format, compute a checksum to avoid redundant uploads, and send the data securely to the backend.

## What Changes

- Implement a plugin registry in `agent/collectors/` to easily add new collection categories without touching the core agent code.
- Implement a normalizer (`agent/normalizer.py`) that formats collected data predictably.
- Implement a checksum mechanism (hashing the normalized JSON) to determine if state has changed since the last run.
- Implement the upload module (`agent/uploader.py`) to send the payload to the backend using the agent's JWT.
- Add mock/stub collector plugins for sysctl and cpu to validate the framework.

## Capabilities

### New Capabilities
- `agent-collection`: The ability of the agent to run registered plugins, gather configurations, and normalize the output.
- `agent-upload`: The ability of the agent to hash its state and upload it to the backend via a REST API, skipping the payload body if the hash hasn't changed.

### Modified Capabilities
None

## Impact

- Python Agent (`agent/collectors/`, `agent/normalizer.py`, `agent/uploader.py`, `agent/collector.py`).
- Creates a standardized JSON schema for the payload sent from the agent to the backend.
