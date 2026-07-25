"""memory collector — stub (implemented in Change 4)."""


def collect() -> dict:
    """Collect memory configuration (HugePages, tuned profiles, NUMA).
    
    Returns:
        Dict with hugepages count/size, tuned profile, and NUMA topology.
    """
    # TODO (Change 4): Parse /proc/meminfo, /sys/kernel/mm/hugepages/, tuned-adm active
    return {}
