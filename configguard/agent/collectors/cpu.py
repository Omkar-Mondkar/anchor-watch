"""cpu collector — stub (implemented in Change 4)."""


def collect() -> dict:
    """Collect CPU tuning parameters (isolcpus, governor, turbo, nohz_full, rcu_nocbs).
    
    Returns:
        Dict of CPU configuration values.
    """
    return {
        'isolcpus': '1-15,17-31',
        'scaling_governor': 'performance',
        'intel_pstate': 'disable',
        'nohz_full': '1-15,17-31',
        'rcu_nocbs': '1-15,17-31'
    }
