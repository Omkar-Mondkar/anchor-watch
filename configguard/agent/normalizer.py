"""
ConfigGuard Agent — Normalizer

Transforms raw collector output into a canonical, diffable JSON structure
that the backend diff engine can compare against baselines.

Stub implementation: returns raw data unchanged.
Full implementation in Change 4.
"""

import logging

logger = logging.getLogger(__name__)


def normalize(raw: dict) -> dict:
    """Normalize raw collector output to canonical shape.

    Args:
        raw: Dict of {category: raw_data_dict} from CollectorRegistry.run_all()

    Returns:
        Normalized dict suitable for baseline comparison and upload.
        Each category value is a flat dict of {parameter: value} strings.
    """
    # TODO (Change 4): Implement per-category normalization logic
    # - sysctl: already flat key-value, ensure string values
    # - cpu: extract isolcpus, governor per core, turbo state
    # - irq: IRQ number -> affinity hex string
    # - nic: interface -> {ring_rx, ring_tx, coalesce_rx_usecs, ...}
    # - ha: file paths -> sha256 hash strings
    # - ntp: {daemon, servers[], stratum, offset_ms}
    # - memory: {hugepages_total, hugepages_size_kb, tuned_profile}
    # - custom_files: file path -> sha256 hash
    logger.debug("normalize() called — stub returning raw data unchanged")
    return raw
