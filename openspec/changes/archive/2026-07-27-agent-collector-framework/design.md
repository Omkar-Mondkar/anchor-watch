## Context

The agent must gather system configuration (sysctl, CPU, networking, etc.), normalize it so it can be compared server-side, and upload it securely. We need a pluggable architecture so adding new collection categories (e.g., custom files) does not require modifying the core runner loop.

## Goals / Non-Goals

**Goals:**
- Implement a plugin registry in Python where each module exports a `collect()` function.
- Implement a normalizer that ensures the gathered data is flat and predictable (string/int types).
- Compute an SHA-256 hash of the normalized JSON state.
- Implement the upload process using `requests` with the JWT identity token (Bearer auth).

**Non-Goals:**
- The server-side diffing engine (this is Change 6).
- Building out all 10+ specific collector modules immediately (we will build 1 or 2 as proof of concept, leaving the rest for later expansion).

## Decisions

- **Plugin Architecture**: We will use a simple registry pattern. In `agent/collectors/registry.py`, we will dynamically import modules in the `collectors/` directory or explicitly register them.
- **Normalization Strategy**: The normalizer will flatten nested dictionaries and ensure consistent key ordering before converting to JSON, so identical states always hash to the exact same SHA-256 string.
- **Checksum Upload**: The upload payload will always include the `hash`. If the backend determines the hash matches the last known state, it can respond with a 304 Not Modified (logic to be handled in the backend later; for now the agent just sends it).

## Risks / Trade-offs

- **Risk**: A poorly written collector plugin throws an exception and crashes the agent.
  - **Mitigation**: The runner loop will catch exceptions per-plugin and continue executing the others, flagging the failed plugin in the output payload.
