"""General-purpose LangGraph agent for Rakuten AI Demo."""

import logging
from datetime import datetime
from pathlib import Path

from langchain.chat_models import init_chat_model
from langgraph.checkpoint.memory import MemorySaver

from deepagents import create_deep_agent
from deepagents.backends import LocalShellBackend

from agent.prompt import AGENT_PROMPT
from config import LLM_MODEL, LLM_TEMPERATURE, LLM_PROVIDER
from tools.web_search import web_search
from tools.memory_tool import memory_tool
from tools.user_input_tool import user_input
from tools.show_widget import show_widget
from tools.gmail_tool import search_emails, read_email
from tools.gcalendar_tool import create_event

logger = logging.getLogger(__name__)

AGENT_NAME = "rakuten_ai"

_BACKEND_DIR = Path(__file__).parent.parent
SKILLS_DIR = str(_BACKEND_DIR / "skills")
MCP_CONFIG = _BACKEND_DIR / "mcp.json"


async def _load_mcp_tools() -> list:
    """Load MCP tools from mcp.json if present."""
    if not MCP_CONFIG.exists():
        return []

    import json
    from langchain_mcp_adapters.client import MultiServerMCPClient

    raw = json.loads(MCP_CONFIG.read_text())
    connections = {}
    for name, cfg in raw.get("mcpServers", {}).items():
        transport = cfg.get("type", cfg.get("transport", "stdio"))
        if transport in ("http", "sse"):
            conn = {"transport": "streamable_http" if transport == "http" else "sse", "url": cfg["url"]}
            if "headers" in cfg:
                conn["headers"] = cfg["headers"]
            connections[name] = conn
        else:
            logger.warning("Skipping MCP server %r: stdio transport not supported", name)

    if not connections:
        return []

    try:
        client = MultiServerMCPClient(connections)
        tools = await client.get_tools()
        logger.info("Loaded %d MCP tool(s) from %s", len(tools), MCP_CONFIG)
        return tools
    except Exception:
        logger.exception("Failed to load MCP tools from %s", MCP_CONFIG)
        return []


def build_graph(language: str = "en", mcp_tools: list | None = None):
    """Build and compile the agent graph.

    Args:
        language: Language code ("ja" or "en")
        mcp_tools: Pre-loaded MCP tools to include. Load once at startup
            with `await _load_mcp_tools()` and pass the result here.

    Returns:
        Compiled LangGraph graph
    """
    logger.info("Building Rakuten AI agent graph (language=%s)", language)

    llm = init_chat_model(
        model=LLM_MODEL,
        model_provider=LLM_PROVIDER,
        temperature=LLM_TEMPERATURE,
    )

    tools = [web_search, memory_tool, user_input, show_widget, search_emails, read_email, create_event, *(mcp_tools or [])]

    formatted_prompt = AGENT_PROMPT.format(
        today=datetime.now().strftime("%Y-%m-%d"),
        timezoneString="Asia/Tokyo",
    )

    graph = create_deep_agent(
        name=AGENT_NAME,
        model=llm,
        tools=tools,
        system_prompt=formatted_prompt,
        skills=[SKILLS_DIR],
        backend=LocalShellBackend(
            root_dir="/tmp/rakuten-ai",
            virtual_mode=True,
            inherit_env=True,
        ),
        checkpointer=MemorySaver(),
    )

    logger.info("Rakuten AI agent graph compiled successfully")
    return graph
