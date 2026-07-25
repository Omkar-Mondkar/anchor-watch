"""
ConfigGuard Agent — Enrollment

Handles one-time token exchange for a short-lived JWT credential.
Uses mTLS where supported.

Stub implementation — real implementation in Change 3.
"""

import logging

logger = logging.getLogger(__name__)


def enroll(api_url: str, one_time_token: str) -> str:
    """Exchange a one-time enrollment token for a JWT.

    Args:
        api_url: ConfigGuard API base URL.
        one_time_token: One-time token issued by POST /api/servers/:id/enroll

    Returns:
        JWT string for subsequent API calls.
        Returns empty string in stub mode.
    """
    # TODO (Change 3): POST to /api/agent/register with one_time_token
    # Store resulting JWT locally with restricted file permissions (0600)
    # Implement automatic rotation before expiry
    logger.info("[STUB] enrollment.enroll() called — returning empty token")
    print("enrollment stub")
    return ''
