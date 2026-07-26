"""
ConfigGuard Agent — Enrollment

Handles one-time token exchange for a short-lived JWT credential.
Uses mTLS where supported.
"""

import logging
import os
import sys
from pathlib import Path

import click
import requests

logger = logging.getLogger(__name__)

TOKEN_FILE = Path(__file__).parent / '.agent_token'

def enroll(api_url: str, server_id: str, one_time_token: str) -> str:
    """Exchange a one-time enrollment token for a JWT.

    Args:
        api_url: ConfigGuard API base URL.
        server_id: The ID of this server in ConfigGuard.
        one_time_token: One-time token issued by POST /api/servers

    Returns:
        JWT string for subsequent API calls.
    """
    url = f"{api_url}/agents/enroll"
    logger.info(f"Enrolling agent with server_id={server_id} at {url}")
    
    try:
        response = requests.post(url, json={
            "serverId": server_id,
            "token": one_time_token
        }, timeout=10)
        
        response.raise_for_status()
        data = response.json()
        jwt_token = data.get('token')
        
        if not jwt_token:
            raise ValueError("No token received in response")
            
        # Write to .agent_token with 0600 permissions
        with os.fdopen(os.open(TOKEN_FILE, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600), 'w') as f:
            f.write(jwt_token)
            
        logger.info(f"Enrollment successful. Token saved securely to {TOKEN_FILE}")
        return jwt_token
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Enrollment failed: {e}")
        if e.response is not None:
            logger.error(f"Server response: {e.response.text}")
        raise

@click.command()
@click.option('--server-id', required=True, help='Server ID registered in ConfigGuard')
@click.option('--api-url',   required=True, help='ConfigGuard API base URL (e.g. http://localhost:5000/api)')
@click.option('--enroll-token', required=True, help='One-time enrollment token')
def main(server_id: str, api_url: str, enroll_token: str) -> None:
    """Enroll the agent and fetch the JWT identity token."""
    logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(name)s: %(message)s')
    try:
        enroll(api_url, server_id, enroll_token)
    except Exception:
        sys.exit(1)

if __name__ == '__main__':
    main()
