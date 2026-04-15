"""Token manager: returns a valid Google access token, refreshing if needed."""
import time
import logging
import httpx

from db import get_token, upsert_token

logger = logging.getLogger(__name__)

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
_EXPIRY_BUFFER = 300  # refresh 5 minutes before actual expiry


async def get_valid_access_token(user_id: str) -> str | None:
    """Return a valid access token for user_id, refreshing if necessary.

    Returns None if no token is stored or the refresh fails.
    """
    row = get_token(user_id)
    if not row:
        return None

    # Token still valid
    if row["expires_at"] - _EXPIRY_BUFFER > time.time():
        return row["access_token"]

    # Need to refresh
    refresh_token = row.get("refresh_token")
    if not refresh_token:
        logger.warning("No refresh_token for user %s; cannot refresh", user_id)
        return None

    from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(GOOGLE_TOKEN_URL, data={
                "grant_type": "refresh_token",
                "refresh_token": refresh_token,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
            })
            resp.raise_for_status()
            data = resp.json()

        new_access_token = data["access_token"]
        new_expires_at = time.time() + data.get("expires_in", 3600)
        # Google may not return a new refresh_token; preserve the old one
        new_refresh_token = data.get("refresh_token")

        upsert_token(
            user_id=user_id,
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            expires_at=new_expires_at,
            email=row.get("email"),
        )
        logger.info("Refreshed access token for user %s", user_id)
        return new_access_token

    except Exception as exc:
        logger.error("Failed to refresh token for user %s: %s", user_id, exc)
        return None
