"""Configuration for Rakuten AI Demo backend."""
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o")
LLM_TEMPERATURE = float(os.getenv("LLM_TEMPERATURE", "0.3"))
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai")

BING_SEARCH_SUBSCRIPTION_KEY = os.getenv("BING_SEARCH_SUBSCRIPTION_KEY", "")
SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY", "")
