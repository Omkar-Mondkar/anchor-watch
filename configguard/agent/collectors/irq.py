"""irq collector — stub (implemented in Change 4)."""


def collect() -> dict:
    """Collect IRQ affinity configuration and irqbalance status.
    
    Returns:
        Dict of IRQ number -> affinity mask, plus irqbalance status.
    """
    # TODO (Change 4): Parse /proc/irq/*/smp_affinity, check irqbalance service status
    return {}
