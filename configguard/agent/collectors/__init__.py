"""
ConfigGuard Agent — Pluggable Collector Registry

Collectors are registered by name. Each collector is a callable that
returns a dict of normalized configuration data.

Usage:
    from collectors import registry
    registry.register('sysctl', sysctl_module.collect)
    results = registry.run_all()
"""

import logging

logger = logging.getLogger(__name__)


class CollectorRegistry:
    """Registry of pluggable configuration collectors."""

    def __init__(self):
        self._collectors: dict = {}

    def register(self, name: str, collector_fn) -> None:
        """Register a collector function under a given name.

        Args:
            name: Collector category name (e.g. 'sysctl', 'cpu').
            collector_fn: Callable that returns a dict of collected data.
        """
        if name in self._collectors:
            logger.warning(f"Overwriting existing collector: {name}")
        self._collectors[name] = collector_fn
        logger.debug(f"Registered collector: {name}")

    def run_all(self) -> dict:
        """Run all registered collectors and return combined results.

        Returns:
            Dict mapping collector name -> collected data dict.
            Failed collectors return an error dict instead of raising.
        """
        results = {}
        for name, collector_fn in self._collectors.items():
            try:
                results[name] = collector_fn()
                logger.debug(f"Collector '{name}' OK: {len(results[name])} items")
            except Exception as exc:
                logger.error(f"Collector '{name}' failed: {exc}")
                results[name] = {"_error": str(exc)}
        return results

    @property
    def registered(self) -> list:
        """Return list of registered collector names."""
        return list(self._collectors.keys())


# ── Default registry instance ─────────────────────────────────────
registry = CollectorRegistry()

# ── Auto-register all built-in collectors ─────────────────────────
from collectors import sysctl, cpu, irq, nic, ha, ntp, memory, custom_files  # noqa: E402

registry.register('sysctl',       sysctl.collect)
registry.register('cpu',          cpu.collect)
registry.register('irq',          irq.collect)
registry.register('nic',          nic.collect)
registry.register('ha',           ha.collect)
registry.register('ntp',          ntp.collect)
registry.register('memory',       memory.collect)
registry.register('custom_files', custom_files.collect)
