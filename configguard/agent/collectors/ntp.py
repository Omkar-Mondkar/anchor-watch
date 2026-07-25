"""ntp collector — stub (implemented in Change 4)."""


def collect() -> dict:
    """Collect time synchronization configuration (NTP, Chrony, PTP).
    
    Returns:
        Dict with sync daemon type, server list, stratum, and offset.
    """
    # TODO (Change 4): Detect and parse chrony/ntpd/ptp4l configuration
    return {}
