"""SQLite token store for Google OAuth credentials."""
import sqlite3
import os

DB_PATH = os.getenv("TOKEN_DB_PATH", "tokens.db")


def _get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    """Create the google_tokens table if it doesn't exist."""
    with _get_conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS google_tokens (
                user_id      TEXT PRIMARY KEY,
                access_token  TEXT NOT NULL,
                refresh_token TEXT,
                expires_at    REAL NOT NULL,
                email         TEXT
            )
        """)
        conn.commit()


def upsert_token(
    user_id: str,
    access_token: str,
    refresh_token: str | None,
    expires_at: float,
    email: str | None = None,
) -> None:
    """Insert or replace a token record, preserving the existing refresh_token when
    Google doesn't re-issue one (refresh_token=None on subsequent auth code exchanges)."""
    with _get_conn() as conn:
        if refresh_token is None:
            # Preserve existing refresh_token
            conn.execute("""
                INSERT INTO google_tokens (user_id, access_token, refresh_token, expires_at, email)
                VALUES (?, ?, (SELECT refresh_token FROM google_tokens WHERE user_id = ?), ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    access_token  = excluded.access_token,
                    expires_at    = excluded.expires_at,
                    email         = excluded.email
            """, (user_id, access_token, user_id, expires_at, email))
        else:
            conn.execute("""
                INSERT INTO google_tokens (user_id, access_token, refresh_token, expires_at, email)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    access_token  = excluded.access_token,
                    refresh_token = excluded.refresh_token,
                    expires_at    = excluded.expires_at,
                    email         = excluded.email
            """, (user_id, access_token, refresh_token, expires_at, email))
        conn.commit()


def get_token(user_id: str) -> dict | None:
    """Return token row as dict, or None if not found."""
    with _get_conn() as conn:
        row = conn.execute(
            "SELECT * FROM google_tokens WHERE user_id = ?", (user_id,)
        ).fetchone()
        return dict(row) if row else None
