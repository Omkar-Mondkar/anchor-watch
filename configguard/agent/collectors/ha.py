"""ha collector — stub (implemented in Change 4)."""


def collect() -> dict:
    """Collect HA configuration (HAProxy, Keepalived, VRRP).
    
    Returns:
        Dict with haproxy config hash, keepalived config hash, and VRRP state.
    """
    # TODO (Change 4): Hash /etc/haproxy/haproxy.cfg, /etc/keepalived/keepalived.conf
    return {}
