"""custom_files collector — stub (implemented in Change 4)."""

# Default file paths to monitor — overridable via server profile
DEFAULT_WATCH_PATHS = [
    '/etc/sysctl.conf',
    '/etc/security/limits.conf',
    '/etc/haproxy/haproxy.cfg',
    '/etc/keepalived/keepalived.conf',
]


def collect(watch_paths: list | None = None) -> dict:
    """Collect SHA-256 hashes of monitored configuration files.
    
    Args:
        watch_paths: List of file paths to hash. Defaults to DEFAULT_WATCH_PATHS.
    
    Returns:
        Dict mapping file path -> {'hash': str, 'exists': bool, 'size': int}.
    """
    # TODO (Change 4): Hash each file with hashlib.sha256, handle missing files gracefully
    return {}
