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

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/oauth/google/callback")
