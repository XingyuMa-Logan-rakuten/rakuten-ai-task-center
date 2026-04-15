"""Google OAuth 2.0 authorization code flow routes."""
import time
import logging
import urllib.parse

import httpx
from fastapi import APIRouter
from fastapi.responses import RedirectResponse, HTMLResponse, JSONResponse

from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
from db import upsert_token, get_token

logger = logging.getLogger(__name__)

router = APIRouter()

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"

SCOPES = " ".join([
    "openid",
    "email",
    "https://www.googleapis.com/auth/gmail.modify",
])

_CLOSE_HTML = """<!DOCTYPE html>
<html>
<head><title>Authorized</title></head>
<body>
<p>Authorization complete. You may close this window.</p>
<script>window.close();</script>
</body>
</html>"""

_ERROR_HTML = """<!DOCTYPE html>
<html>
<head><title>Authorization Error</title></head>
<body>
<p>Authorization failed: {error}</p>
<script>setTimeout(function(){{window.close();}}, 3000);</script>
</body>
</html>"""


@router.get("/oauth/google/auth")
async def google_auth(user_id: str):
    """Redirect the browser to Google's OAuth consent screen."""
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": SCOPES,
        "access_type": "offline",
        "prompt": "consent",
        "state": user_id,
    }
    url = GOOGLE_AUTH_URL + "?" + urllib.parse.urlencode(params)
    return RedirectResponse(url)


@router.get("/oauth/google/callback")
async def google_callback(code: str | None = None, state: str | None = None, error: str | None = None):
    """Exchange the authorization code for tokens and store them."""
    if error or not code:
        msg = error or "missing_code"
        logger.error("OAuth callback error: %s", msg)
        return HTMLResponse(_ERROR_HTML.format(error=msg), status_code=400)

    user_id = state or ""

    try:
        async with httpx.AsyncClient() as client:
            token_resp = await client.post(GOOGLE_TOKEN_URL, data={
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            })
            token_resp.raise_for_status()
            token_data = token_resp.json()

            # Fetch email from userinfo
            userinfo_resp = await client.get(
                GOOGLE_USERINFO_URL,
                headers={"Authorization": f"Bearer {token_data['access_token']}"},
            )
            email = userinfo_resp.json().get("email") if userinfo_resp.is_success else None

    except Exception as exc:
        logger.error("Token exchange failed: %s", exc)
        return HTMLResponse(_ERROR_HTML.format(error=str(exc)), status_code=500)

    upsert_token(
        user_id=user_id,
        access_token=token_data["access_token"],
        refresh_token=token_data.get("refresh_token"),
        expires_at=time.time() + token_data.get("expires_in", 3600),
        email=email,
    )
    logger.info("Stored tokens for user %s (%s)", user_id, email)
    return HTMLResponse(_CLOSE_HTML)


@router.get("/oauth/google/status")
async def google_status(user_id: str):
    """Return whether the user has a stored Google token."""
    row = get_token(user_id)
    if row:
        return JSONResponse({"connected": True, "email": row.get("email")})
    return JSONResponse({"connected": False, "email": None})
