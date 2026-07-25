"""nic collector — stub (implemented in Change 4)."""


def collect() -> dict:
    """Collect NIC configuration (ring buffers, interrupt coalescing, driver, firmware, offloads).
    
    Returns:
        Dict of interface name -> ethtool parameters dict.
    """
    # TODO (Change 4): Run ethtool -g, ethtool -c, ethtool -i, ethtool -k per interface
    return {}
