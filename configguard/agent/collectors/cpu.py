"""cpu collector — stub (implemented in Change 4)."""


def collect() -> dict:
    """Collect CPU tuning parameters (isolcpus, governor, turbo, nohz_full, rcu_nocbs).
    
    Returns:
        Dict of CPU configuration values.
    """
    # TODO (Change 4): Parse /proc/cmdline, /sys/devices/system/cpu/*/cpufreq/scaling_governor
    return {}
