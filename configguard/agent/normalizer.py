"""
ConfigGuard Agent — Normalizer

Transforms raw collector output into a canonical, diffable JSON structure
that the backend diff engine can compare against baselines.

Stub implementation: returns raw data unchanged.
Full implementation in Change 4.
"""

import logging

logger = logging.getLogger(__name__)


import json
import hashlib

def _flatten_dict(d: dict, parent_key: str = '', sep: str = '.') -> dict:
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(_flatten_dict(v, new_key, sep=sep).items())
        elif isinstance(v, list):
            items.append((new_key, ",".join(str(i) for i in sorted(v))))
        else:
            items.append((new_key, str(v)))
    return dict(items)

def normalize(raw: dict) -> dict:
    """Normalize raw collector output to canonical shape."""
    normalized = {}
    for category, data in raw.items():
        if isinstance(data, dict):
            normalized[category] = _flatten_dict(data)
        else:
            normalized[category] = str(data)
            
    # Return a new dict with keys sorted deterministically
    return {k: normalized[k] for k in sorted(normalized.keys())}

def compute_hash(normalized_data: dict) -> str:
    """Compute SHA-256 hash of the normalized JSON string."""
    serialized = json.dumps(normalized_data, sort_keys=True, separators=(',', ':'))
    return hashlib.sha256(serialized.encode('utf-8')).hexdigest()
