## ADDED Requirements

### Requirement: Agent collector registry is importable
The `agent/collectors/__init__.py` SHALL define a `CollectorRegistry` class with a `register(name, collector_fn)` method and a `run_all()` method that invokes all registered collectors and returns a dict of `{name: result}`.

#### Scenario: Registry is imported and collectors are registered
- **WHEN** `from collectors import CollectorRegistry` is executed
- **THEN** the import succeeds and `registry.run_all()` returns a dict (values may be empty dicts at this stage)

### Requirement: Stub collector modules exist for all eight categories
The `agent/collectors/` directory SHALL contain: `sysctl.py`, `cpu.py`, `irq.py`, `nic.py`, `ha.py`, `ntp.py`, `memory.py`, `custom_files.py`. Each SHALL export a function `collect() -> dict` that returns an empty dict at this stage (implementation comes in Change 4).

#### Scenario: All collector stubs are importable
- **WHEN** each collector module is imported
- **THEN** `collect()` is callable and returns a dict without raising an exception

### Requirement: Agent entrypoint accepts server ID and API URL arguments
`agent/collector.py` SHALL accept `--server-id` and `--api-url` CLI arguments and log them at startup. It SHALL call `CollectorRegistry.run_all()` and print the result dict as JSON.

#### Scenario: Agent is invoked from the command line
- **WHEN** `python collector.py --server-id test-01 --api-url http://localhost/api` is run
- **THEN** the process exits 0 and prints a valid JSON object

### Requirement: Agent requirements file is complete
`agent/requirements.txt` SHALL list all Python dependencies needed for Phase 1: `requests`, `python-dotenv`, `click` (or `argparse`), `cryptography` (for mTLS in Change 3).

#### Scenario: Requirements install cleanly
- **WHEN** `pip install -r requirements.txt` is run in a clean Python 3.12 virtualenv
- **THEN** all packages install without errors
