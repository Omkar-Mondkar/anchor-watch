"""
ConfigGuard Agent — Main collector entrypoint.

Usage:
    python collector.py --server-id <id> --api-url <url>

The agent:
1. Fetches its server profile from the API (Change 3+)
2. Runs all registered collector modules
3. Normalizes the output
4. Computes a checksum
5. Uploads to the ConfigGuard API (or sends a heartbeat if unchanged)
"""

import json
import logging
import sys

import click

from collectors import registry
from normalizer import normalize
from uploader import upload
from enrollment import enroll

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    stream=sys.stdout,
)
logger = logging.getLogger('configguard.agent')


@click.command()
@click.option('--server-id', required=True, help='Server ID registered in ConfigGuard')
@click.option('--api-url',   required=True, help='ConfigGuard API base URL (e.g. https://configguard.corp.com/api)')
@click.option('--token',     default='',    help='Enrollment or JWT token (optional for stub run)')
@click.option('--dry-run',   is_flag=True,  help='Collect and normalize but do not upload')
def main(server_id: str, api_url: str, token: str, dry_run: bool) -> None:
    """ConfigGuard configuration collector agent."""
    logger.info(f"Starting collector — server_id={server_id}, api_url={api_url}")
    logger.info(f"Registered collectors: {registry.registered}")

    if not token:
        from pathlib import Path
        token_file = Path(__file__).parent / '.agent_token'
        if token_file.exists():
            token = token_file.read_text().strip()
            logger.info("Loaded agent token from .agent_token")
        else:
            logger.warning("No token provided and .agent_token not found.")

    # Step 1: Collect from all modules
    raw = registry.run_all()
    logger.info(f"Collection complete — categories: {list(raw.keys())}")

    # Step 2: Normalize
    normalized = normalize(raw)
    logger.info(f"Normalization complete")

    # Step 3: Output (always print so the caller can inspect)
    output = {
        'server_id':  server_id,
        'api_url':    api_url,
        'snapshot':   normalized,
        'collectors': list(raw.keys()),
    }
    print(json.dumps(output, indent=2, default=str))

    if dry_run:
        logger.info("Dry run — skipping upload")
        sys.exit(0)

    # Step 4: Upload
    success = upload(api_url, token, output)
    if success:
        logger.info("Upload complete")
        sys.exit(0)
    else:
        logger.error("Upload failed")
        sys.exit(1)


if __name__ == '__main__':
    main()
