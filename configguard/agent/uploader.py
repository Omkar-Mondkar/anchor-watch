"""
ConfigGuard Agent — Uploader

Uploads a normalized configuration snapshot to the ConfigGuard API.
Implements short-circuit: sends heartbeat-only if checksum unchanged.

Stub implementation — real implementation in Change 4.
"""

import hashlib
import json
import logging

logger = logging.getLogger(__name__)

# In-memory last checksum (persisted to disk in Change 4)
_last_checksum: str = ''


def _compute_checksum(payload: dict) -> str:
    """Compute SHA-256 checksum of the snapshot payload."""
    serialized = json.dumps(payload.get('snapshot', {}), sort_keys=True, default=str)
    return hashlib.sha256(serialized.encode()).hexdigest()


def upload(api_url: str, jwt: str, payload: dict) -> bool:
    """Upload snapshot to the ConfigGuard API.

    If the snapshot checksum matches the last uploaded checksum,
    sends a lightweight heartbeat instead of the full snapshot.

    Args:
        api_url: ConfigGuard API base URL.
        jwt: JWT credential for authentication.
        payload: Normalized snapshot dict from normalizer.normalize()

    Returns:
        True if upload (or heartbeat) succeeded, False otherwise.
    """
    global _last_checksum

    checksum = _compute_checksum(payload)
    logger.debug(f"Snapshot checksum: {checksum}")

    if checksum == _last_checksum:
        # TODO (Change 4): POST /api/agent/heartbeat with {"serverId": ..., "checksum": ...}
        logger.info("[STUB] Checksum unchanged — heartbeat-only (stub)")
        print("upload stub: heartbeat")
        return True

    # TODO (Change 4): POST /api/agent/upload with full normalized snapshot
    logger.info("[STUB] Snapshot changed — full upload (stub)")
    print("upload stub: full upload")
    _last_checksum = checksum
    return True
