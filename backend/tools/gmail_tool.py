"""Dummy Gmail tools for demo purposes."""
import json
from langchain_core.tools import tool

# ---------------------------------------------------------------------------
# Dummy inbox
# ---------------------------------------------------------------------------

_EMAILS = [
    {
        "id": "msg_001",
        "from": "Sakura Preschool <info@sakura-preschool.co.jp>",
        "to": "parent@example.com",
        "subject": "Swimming Trial – June 14th | Participation Fee ¥2,000 Due June 7th",
        "date": "Wed, 28 May 2026 09:15:00 +0900",
        "snippet": (
            "We are pleased to invite your child to our upcoming swimming trial on "
            "Saturday, June 14th at the school pool. The participation fee of ¥2,000 "
            "is due by June 7th. Please see the full details inside."
        ),
        "body": """\
Dear Parents and Guardians,

We hope this message finds you well!

Sakura Preschool is delighted to announce a Swimming Trial for all enrolled children.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  EVENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Date      : Saturday, June 14th, 2026
  Time      : 10:00 AM – 11:30 AM
  Location  : Sakura Preschool Indoor Pool (Building B, 1F)
  For       : All children aged 3–6 currently enrolled

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PARTICIPATION FEE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Amount    : ¥2,000 per child
  Due date  : Saturday, June 7th, 2026
  Payment   : Please submit cash in the provided envelope to your
              child's homeroom teacher, or pay via bank transfer
              to the account listed below.

  Bank      : Rakuten Bank
  Branch    : 201
  Account   : Savings 7654321
  Name      : さくら保育園父母会

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  WHAT TO BRING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Swimsuit and swim cap (no logos on swimwear, please)
  • Towel × 2
  • Water bottle (no juice or sports drinks)
  • Signed permission slip (attached to this email)

Please return the signed permission slip to your child's teacher
by Friday, June 6th.

If you have any questions or your child has medical conditions we
should be aware of, please contact us at:
  📧 info@sakura-preschool.co.jp
  📞 03-1234-5678 (Mon–Fri, 9 AM – 5 PM)

We look forward to a fun and safe day at the pool!

Warm regards,

Yuki Tanaka
Activities Coordinator
Sakura Preschool
""",
    },
]


# ---------------------------------------------------------------------------
# Tools
# ---------------------------------------------------------------------------

@tool("search_emails")
def search_emails(query: str) -> str:
    """Search the user's Gmail inbox and return matching emails as a list of
    summaries (id, from, date, subject, snippet). Use read_email to fetch the
    full body of a specific message.

    Args:
        query: Keywords to search for, e.g. "swimming", "preschool", "invoice".
               Pass an empty string or "inbox" to list recent messages.
    """
    results = _EMAILS

    summaries = [
        {
            "id": e["id"],
            "from": e["from"],
            "date": e["date"],
            "subject": e["subject"],
            "snippet": e["snippet"],
        }
        for e in results
    ]
    return json.dumps({"count": len(summaries), "emails": summaries})


@tool("read_email")
def read_email(message_id: str) -> str:
    """Fetch the full content of a specific email by its message ID.

    Args:
        message_id: The id field returned by search_emails (e.g. "msg_001").
    """
    for e in _EMAILS:
        if e["id"] == message_id:
            return json.dumps({
                "id": e["id"],
                "from": e["from"],
                "to": e["to"],
                "date": e["date"],
                "subject": e["subject"],
                "body": e["body"],
            })
    return json.dumps({"error": f"Email with id '{message_id}' not found."})
