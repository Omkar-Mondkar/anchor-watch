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

import requests
import urllib.parse
from pathlib import Path

HASH_FILE = Path(__file__).parent / '.last_hash'

def _compute_checksum(payload: dict) -> str:
    from normalizer import compute_hash
    return compute_hash(payload.get('snapshot', {}))

def upload(api_url: str, jwt: str, payload: dict) -> bool:
    """Upload snapshot to the ConfigGuard API."""
    checksum = _compute_checksum(payload)
    logger.debug(f"Snapshot checksum: {checksum}")
    
    last_checksum = ''
    if HASH_FILE.exists():
        last_checksum = HASH_FILE.read_text().strip()

    headers = {}
    if jwt:
        headers['Authorization'] = f"Bearer {jwt}"
        
    server_id = payload.get('server_id')
    
    if checksum == last_checksum:
        url = f"{api_url}/servers/{server_id}/heartbeat"
        logger.info(f"Checksum unchanged — sending heartbeat to {url}")
        try:
            res = requests.post(url, headers=headers, json={"checksum": checksum}, timeout=10)
            res.raise_for_status()
            return True
        except Exception as e:
            logger.error(f"Heartbeat failed: {e}")
            return False

    url = f"{api_url}/servers/{server_id}/snapshots"
    logger.info(f"Snapshot changed — uploading full snapshot to {url}")
    try:
        # Add the computed hash to the payload
        payload['hash'] = checksum
        res = requests.post(url, headers=headers, json=payload, timeout=10)
        res.raise_for_status()
        
        # Save the new hash on success
        with open(HASH_FILE, 'w') as f:
            f.write(checksum)
            
        return True
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        return False
