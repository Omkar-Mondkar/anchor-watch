"""sysctl collector — stub (implemented in Change 4)."""


def collect() -> dict:
    """Collect all sysctl kernel parameters.
    
    Returns:
        Dict mapping parameter name -> current value.
        Example: {'net.core.rmem_max': '134217728', ...}
    """
    # TODO (Change 4): Run `sysctl -a` and parse output
    return {}
