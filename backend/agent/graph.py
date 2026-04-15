"""General-purpose LangGraph agent for Rakuten AI Demo."""

import logging
from datetime import datetime

from langchain.chat_models import init_chat_model
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, StateGraph, MessagesState
from langgraph.prebuilt import create_react_agent

from agent.prompt import AGENT_PROMPT
from config import LLM_MODEL, LLM_TEMPERATURE, LLM_PROVIDER
from tools.web_search import web_search
from tools.memory_tool import memory_tool
from tools.user_input_tool import user_input
from tools.show_widget import show_widget

logger = logging.getLogger(__name__)

AGENT_NAME = "rakuten_ai"


def build_graph(language: str = "en"):
    """Build and compile the agent graph.

    Args:
        language: Language code ("ja" or "en")

    Returns:
        Compiled LangGraph graph
    """
    logger.info(f"Building Rakuten AI agent graph (language={language})")

    llm = init_chat_model(
        model=LLM_MODEL,
        model_provider=LLM_PROVIDER,
        temperature=LLM_TEMPERATURE,
    )

    tools = [web_search, memory_tool, user_input, show_widget]

    formatted_prompt = AGENT_PROMPT.format(
        today=datetime.now().strftime("%Y-%m-%d"),
        timezoneString="Asia/Tokyo",
    )

    agent = create_react_agent(
        name=AGENT_NAME,
        model=llm,
        tools=tools,
        prompt=formatted_prompt,
    )

    graph = (
        StateGraph(MessagesState)
        .add_node(agent)
        .add_edge(START, AGENT_NAME)
    )

    logger.info("Rakuten AI agent graph compiled successfully")
    return graph.compile(checkpointer=MemorySaver())
