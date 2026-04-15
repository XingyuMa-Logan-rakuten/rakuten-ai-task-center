"""Dummy Google Calendar tool for demo purposes."""
import json
from langchain_core.tools import tool


@tool("create_event")
def create_event(summary: str, start_time: str, end_time: str) -> str:
    """Create a new event on the user's Google Calendar.

    Args:
        summary: Title of the event (e.g. "Swimming Trial – Sakura Preschool").
        start_time: Event start in ISO 8601 format (e.g. "2026-06-14T10:00:00+09:00").
        end_time: Event end in ISO 8601 format (e.g. "2026-06-14T11:30:00+09:00").
    """
    return json.dumps({
        "status": "confirmed",
        "id": "gcal_demo_001",
        "summary": summary,
        "start": start_time,
        "end": end_time,
        "calendar": "primary",
        "html_link": "https://calendar.google.com/calendar/r/eventedit",
    })
