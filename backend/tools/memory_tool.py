"""Memory Tool - Retrieves user memory including behavioral and conversational context."""

import logging
from typing import Dict, Any
from langchain_core.tools import tool
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)


class MemoryToolInput(BaseModel):
    """Input schema for memory_tool."""
    scope: str = Field(
        description="Type of memory to retrieve: 'conversational' for past conversation context, 'behavioral' for browsing/purchase history"
    )


# Mock behavioral data
BEHAVIORAL_MEMORY = {
    "purchase_history": [
        {
            "ordered_at": "2026-03-17T10:30:00+09:00",
            "items": [
                {
                    "product_id": "00000215175-00010015753-1",
                    "product_name": "アーテミス アガリクスI/S 小粒 3kg ドッグフード",
                    "shop_name": "ドッグパラダイスぷらすニャン",
                    "unit_price": 5720,
                    "quantity": 1,
                },
            ]
        },
        {
            "ordered_at": "2026-03-15T14:20:00+09:00",
            "items": [
                {
                    "product_id": "00000264309-00010480680-1",
                    "product_name": "ナイキ ランニングシューズ エア ズーム ライバル フライ 3",
                    "shop_name": "ヒマラヤ楽天市場店",
                    "unit_price": 7510,
                    "quantity": 1,
                },
            ]
        },
        {
            "ordered_at": "2026-02-26T10:30:00+09:00",
            "items": [
                {
                    "product_id": "00000202799-00010000025-1",
                    "product_name": "スカルプD 薬用スカルプシャンプー 350ml",
                    "shop_name": "アンファーストア",
                    "unit_price": 4190,
                    "quantity": 1,
                },
            ]
        },
    ],
    "browsing_history": [
        {
            "browsed_at": "2026-03-18T15:20:00+09:00",
            "product_name": "緑の魔女 ランドリー 業務用(5L)",
            "category": "laundry detergent",
            "note": "Viewed again recently — likely needs to reorder"
        },
        {
            "browsed_at": "2026-03-17T09:00:00+09:00",
            "product_name": "トイレットペーパー シングル 芯なし 業務用 150m 48ロール",
            "category": "toilet paper",
            "note": "Viewed recently — possibly running low"
        },
    ]
}

CONVERSATIONAL_MEMORY = {
    "episodic_memory": [
        {
            "timestamp": "2026-03-17T10:30:00+09:00",
            "context": "Purchased dog food (Artemis Agalikus) — buys monthly for their small dog"
        },
        {
            "timestamp": "2026-03-15T14:20:00+09:00",
            "context": "Purchased Nike running shoes — user is a runner"
        },
        {
            "timestamp": None,
            "context": "Regularly purchases household replenishables: toilet paper (~5 weeks), laundry detergent (~6 weeks), shampoo (~3 weeks)"
        },
    ],
    "user_profile": {
        "pet_type": "Small dog",
        "lifestyle": "Active runner, values convenience",
        "recurring_products": [
            {
                "product_name": "Dog food (Artemis Agalikus 3kg)",
                "purchase_frequency": "Monthly",
                "last_purchased": "2026-03-17",
                "next_expected": "2026-04-14"
            },
            {
                "product_name": "Toilet paper (48 rolls)",
                "purchase_frequency": "Every 5-6 weeks",
                "last_purchased": "2026-02-12",
            },
            {
                "product_name": "Laundry detergent (5L)",
                "purchase_frequency": "Every 6 weeks",
                "last_purchased": "2026-02-05",
            },
        ]
    }
}


@tool("memory_tool", args_schema=MemoryToolInput)
def memory_tool(scope: str) -> Dict[str, Any]:
    """
    Retrieve user memory to personalize interactions and recommendations.

    Use this tool to access:
    - 'behavioral': User's past purchases and browsing history
    - 'conversational': Past conversation context and user profile

    Args:
        scope: Type of memory — 'conversational' or 'behavioral'

    Returns:
        Dictionary containing the requested memory data
    """
    logger.info(f"[MEMORY_TOOL] Retrieving {scope} memory")

    if scope == "behavioral":
        data = BEHAVIORAL_MEMORY
        return {
            "scope": "behavioral",
            "data": data,
            "summary": f"Retrieved user's behavioral history: {len(data.get('purchase_history', []))} past purchases and {len(data.get('browsing_history', []))} recently browsed items"
        }
    elif scope == "conversational":
        data = CONVERSATIONAL_MEMORY
        return {
            "scope": "conversational",
            "data": data,
            "summary": f"Retrieved user's conversational context: {len(data.get('episodic_memory', []))} episodic memories and user profile data"
        }
    else:
        return {"error": f"Invalid scope '{scope}'. Must be 'behavioral' or 'conversational'"}
