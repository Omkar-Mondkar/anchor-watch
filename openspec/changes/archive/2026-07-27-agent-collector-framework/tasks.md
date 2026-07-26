## 1. Plugin Registry & Collectors

- [x] 1.1 Create `agent/collectors/registry.py` with a simple registration mechanism for plugins.
- [x] 1.2 Create `agent/collectors/sysctl.py` as a mock collector that returns a static dictionary of sysctl values.
- [x] 1.3 Create `agent/collectors/cpu.py` as a mock collector that returns static CPU info.

## 2. Normalization & Hashing

- [x] 2.1 Update `agent/normalizer.py` to flatten dictionaries and sort keys deterministically.
- [x] 2.2 Add a function in `agent/normalizer.py` to compute the SHA-256 hash of the normalized JSON string.

## 3. Upload Mechanism

- [x] 3.1 Update `agent/uploader.py` to accept the JWT token and the payload (which includes the hash).
- [x] 3.2 Implement a `requests.post` call in `uploader.py` sending the payload to `/api/servers/:id/snapshots` (we'll implement the backend for this in the diff engine change, but the agent should try to send it).

## 4. Integration

- [x] 4.1 Update `agent/collector.py` to wire everything together: gather data, normalize, hash, and call `upload`.
