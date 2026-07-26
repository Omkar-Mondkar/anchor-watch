"""sysctl collector — stub (implemented in Change 4)."""


def collect() -> dict:
    """Collect all sysctl kernel parameters.
    
    Returns:
        Dict mapping parameter name -> current value.
        Example: {'net.core.rmem_max': '134217728', ...}
    """
    return {
        'net.core.rmem_max': '134217728',
        'net.ipv4.tcp_rmem': '4096 87380 134217728',
        'kernel.numa_balancing': '0',
        'vm.swappiness': '1'
    }
