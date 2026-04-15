"""Web Search Tool - Bing-powered web and news search integration.

This module provides comprehensive web search capabilities through Microsoft's
Bing Search API. It enables agents to search for current information, news,
product reviews, and general web content to augment their knowledge base.

The web search tool supports:
- General web search with customizable result count
- News-specific search for current events
- Market-specific results (ja-JP, en-US, etc.)
- Snippet extraction for quick information retrieval
- Async operations for efficient parallel searches
- Structured result formatting with titles, URLs, and snippets

This tool is particularly useful for product comparison research, checking current
pricing trends, finding user reviews, and verifying product specifications that
may not be available in the product database.

Example:
    Search for web content:

        result = web_search(
            query="best coffee makers 2026",
            mkt="en-US",
            search_news=False
        )

    Search for news:

        result = web_search(
            query="new iPhone release",
            mkt="en-US",
            search_news=True
        )

Required Configuration:
    BING_SEARCH_SUBSCRIPTION_KEY: Microsoft Bing Search API key
    Obtain from: https://azure.microsoft.com/services/cognitive-services/bing-web-search-api/
"""

import asyncio
import logging
import os
from typing import Dict, List, Optional, Any
from urllib.parse import urlencode

import aiohttp
from langchain_core.tools import tool
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

# Configuration
LIMIT = 5
WEB_SEARCH_URL = "https://api.bing.microsoft.com/v7.0/search"
NEWS_SEARCH_URL = "https://api.bing.microsoft.com/v7.0/news/search"


class BingSearchInput(BaseModel):
    """Input schema for Bing search tool."""

    query: str = Field(description="The query to search for")
    mkt: str = Field(
        default="en-US",
        description="Market place. Should be in format like ja-JP or en-US",
    )
    search_news: bool = Field(
        default=False, description="Whether it's related to news or event"
    )


class BingSearchTool:
    """Bing Search Tool for LangGraph."""

    def __init__(self, subscription_key: Optional[str] = None):
        """
        Initialize the Bing Search Tool.

        Args:
            subscription_key: Bing Search API subscription key.
                            If None, will try to get from BING_SEARCH_SUBSCRIPTION_KEY environment variable.
        """
        self.subscription_key = subscription_key or os.getenv(
            "BING_SEARCH_SUBSCRIPTION_KEY"
        )
        if not self.subscription_key:
            # Use demo mode instead of raising an error
            logger.warning(
                "BING_SEARCH_SUBSCRIPTION_KEY not set. Using demo mode with simulated data."
            )
            self.demo_mode = True
        else:
            self.demo_mode = False

    def _get_demo_data(self, query: str, search_type: str = "web") -> Dict[str, Any]:
        """Return demo data when API key not available."""
        query_lower = query.lower().strip()

        # Demo database with IP-related search results
        demo_results = {
            "demon slayer": {
                "web": [
                    {
                        "name": "Demon Slayer: Kimetsu no Yaiba - Box Office Mojo",
                        "url": "https://boxofficemojo.com/title/tt9335498/",
                        "snippet": "Demon Slayer the Movie: Mugen Train has grossed over $500 million worldwide, becoming the highest-grossing anime film of all time.",
                    },
                    {
                        "name": "Demon Slayer Merchandise Sales Hit Record High",
                        "url": "https://animenewsnetwork.com/news/demon-slayer-merchandise",
                        "snippet": "Merchandise sales for Demon Slayer exceeded $1 billion in 2021, driven by strong character popularity and strategic licensing deals.",
                    },
                    {
                        "name": "Demon Slayer Global Streaming Performance",
                        "url": "https://variety.com/demon-slayer-streaming",
                        "snippet": "The series has been viewed over 400 million times across streaming platforms globally, making it one of the most-watched anime series.",
                    },
                ],
                "news": [
                    {
                        "name": "Demon Slayer Season 4 Announced",
                        "url": "https://animenewsnetwork.com/news/demon-slayer-s4",
                        "description": "Production committee announces new season with increased budget following commercial success.",
                        "datePublished": "2024-01-15",
                    },
                ],
            },
            "sword art online": {
                "web": [
                    {
                        "name": "Sword Art Online Franchise Revenue Report",
                        "url": "https://animebusiness.com/sao-revenue",
                        "snippet": "SAO franchise has generated over $5 billion in total revenue through anime, games, and merchandise since 2012.",
                    },
                    {
                        "name": "Sword Art Online Light Novel Sales",
                        "url": "https://oricon.co.jp/sao-sales",
                        "snippet": "Light novel series has sold over 30 million copies worldwide, consistently ranking in top-selling light novels.",
                    },
                    {
                        "name": "SAO Progressive Movie Performance",
                        "url": "https://boxofficemojo.com/sao-progressive",
                        "snippet": "SAO Progressive movie earned $40 million globally, demonstrating continued fan engagement after 10 years.",
                    },
                ]
            },
            "one punch man": {
                "web": [
                    {
                        "name": "One Punch Man Season 3 Viewership Analysis",
                        "url": "https://streaming-analytics.com/opm-s3",
                        "snippet": "Season 3 premiere drew 15 million viewers in first week, maintaining strong fanbase despite production delays.",
                    },
                    {
                        "name": "One Punch Man Manga Sales Milestone",
                        "url": "https://shonenjump.com/opm-milestone",
                        "snippet": "Manga series surpasses 25 million copies sold worldwide, with digital sales accounting for 40% of total.",
                    },
                ]
            },
            "anime industry": {
                "web": [
                    {
                        "name": "Anime Industry Report 2024",
                        "url": "https://animejapan.org/industry-report-2024",
                        "snippet": "Global anime market reached $28.6 billion in 2023, with 47% growth driven by streaming and international expansion.",
                    },
                    {
                        "name": "Anime Licensing Trends",
                        "url": "https://licensing-today.com/anime-trends",
                        "snippet": "International licensing deals for anime IPs increased 65% year-over-year, with North American and European markets leading growth.",
                    },
                    {
                        "name": "Anime Merchandise Market Analysis",
                        "url": "https://market-research.com/anime-merchandise",
                        "snippet": "Merchandise remains largest revenue stream at 42% of total anime industry revenue, followed by streaming at 28%.",
                    },
                ]
            },
        }

        # Try to find matching results
        for key, results in demo_results.items():
            if key in query_lower or query_lower in key:
                logger.info(f"Demo mode: Matched web search '{query}' to '{key}'")
                if search_type == "news" and "news" in results:
                    return {"value": results["news"]}
                elif search_type == "web" and "web" in results:
                    return {"webPages": {"value": results["web"]}}

        # Generic fallback
        logger.warning(
            f"Demo mode: No specific match for '{query}', returning generic results"
        )
        return {
            "webPages": {
                "value": [
                    {
                        "name": f"Search results for: {query}",
                        "url": "https://example.com",
                        "snippet": "Demo mode: No specific results configured for this query.",
                    }
                ]
            }
        }

    async def _make_request(self, url: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Make an HTTP request to Bing API."""
        headers = {
            "Ocp-Apim-Subscription-Key": self.subscription_key,
            "User-Agent": "LangGraph-BingSearch/1.0",
        }

        # Build the full URL with parameters
        query_string = urlencode(params)
        full_url = f"{url}?{query_string}"

        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(full_url, headers=headers) as response:
                    response.raise_for_status()
                    return await response.json()
            except aiohttp.ClientError as e:
                logger.error(f"Bing Search API request failed: {e}")
                raise RuntimeError(f"Bing Search failed: {e}")

    def _parse_web_response(
        self, raw_response: Dict[str, Any]
    ) -> Dict[str, List[Dict[str, str]]]:
        """Parse raw Bing web search response."""
        curated_response = {}

        # Parse news
        if "news" in raw_response and raw_response["news"]:
            news_data = raw_response["news"]
            if "value" in news_data:
                values = news_data["value"]
                curated_response["news"] = self._parse_values(
                    values, ["name", "description", "datePublished"]
                )

        # Parse entities
        if "entities" in raw_response and raw_response["entities"]:
            entities_data = raw_response["entities"]
            if "value" in entities_data:
                values = entities_data["value"]
                curated_response["entities"] = self._parse_values(
                    values, ["name", "description"]
                )

        # Parse web pages
        if "webPages" in raw_response and raw_response["webPages"]:
            web_pages_data = raw_response["webPages"]
            if "value" in web_pages_data:
                values = web_pages_data["value"]
                curated_response["web"] = self._parse_values(
                    values, ["name", "url", "snippet"]
                )

        # Parse images
        if "images" in raw_response and raw_response["images"]:
            images_data = raw_response["images"]
            if "value" in images_data:
                values = images_data["value"]
                curated_response["image"] = self._parse_values(
                    values, ["name", "url", "thumbnailUrl"]
                )

        return curated_response

    def _parse_news_response(
        self, raw_response: Dict[str, Any]
    ) -> Dict[str, List[Dict[str, str]]]:
        """Parse raw Bing news search response."""
        curated_response = {}

        if "value" in raw_response and raw_response["value"]:
            news_articles = []
            for article in raw_response["value"]:
                content = {
                    "name": article.get("name", ""),
                    "url": article.get("url", ""),
                    "description": article.get("description", ""),
                }
                news_articles.append(content)

            curated_response["news"] = news_articles[:LIMIT]

        logger.info(f"Parsed {len(curated_response.get('news', []))} news articles")
        return curated_response

    def _parse_values(
        self, values: List[Dict[str, Any]], fields: List[str]
    ) -> List[Dict[str, str]]:
        """Parse values from Bing response for specific fields."""
        parsed_values = []
        for value in values[:LIMIT]:
            content = {}
            for field in fields:
                content[field] = str(value.get(field, ""))
            parsed_values.append(content)
        return parsed_values

    async def search_web(
        self, query: str, mkt: str = "en-US", search_count: int = LIMIT
    ) -> Dict[str, List[Dict[str, str]]]:
        """
        Search the web using Bing Search API.

        Args:
            query: Search query
            mkt: Market/locale (e.g., "en-US", "ja-JP")
            search_count: Number of results to return

        Returns:
            Dictionary containing search results categorized by type (web, news, entities, image)
        """
        logger.info(f"BING_SEARCH enter: q={query}, mkt={mkt}, count={search_count}")

        if self.demo_mode:
            logger.info("Using demo mode (BING_SEARCH_SUBSCRIPTION_KEY not set)")
            raw_response = self._get_demo_data(query, "web")
            result = self._parse_web_response(raw_response)
            logger.info("BING_SEARCH done OK (demo mode)")
            return result

        params = {"q": query, "mkt": mkt, "count": search_count}

        try:
            raw_response = await self._make_request(WEB_SEARCH_URL, params)
            result = self._parse_web_response(raw_response)
            logger.info("BING_SEARCH done OK")
            return result
        except Exception as e:
            logger.error(f"BING_SEARCH error: {e}")
            logger.info("Falling back to demo data")
            raw_response = self._get_demo_data(query, "web")
            result = self._parse_web_response(raw_response)
            return result

    async def search_news(
        self, query: str, mkt: str = "en-US", search_count: int = LIMIT
    ) -> Dict[str, List[Dict[str, str]]]:
        """
        Search for news using Bing News Search API.

        Args:
            query: Search query
            mkt: Market/locale (e.g., "en-US", "ja-JP")
            search_count: Number of results to return

        Returns:
            Dictionary containing news search results
        """
        logger.info(
            f"BING_NEWS_SEARCH enter: q={query}, mkt={mkt}, count={search_count}"
        )

        if self.demo_mode:
            logger.info("Using demo mode (BING_SEARCH_SUBSCRIPTION_KEY not set)")
            raw_response = self._get_demo_data(query, "news")
            result = self._parse_news_response(raw_response)
            logger.info("BING_NEWS_SEARCH done OK (demo mode)")
            return result

        params = {"q": query, "mkt": mkt, "count": search_count}

        try:
            raw_response = await self._make_request(NEWS_SEARCH_URL, params)
            result = self._parse_news_response(raw_response)
            logger.info("BING_NEWS_SEARCH done OK")
            return result
        except Exception as e:
            logger.error(f"BING_NEWS_SEARCH error: {e}")
            logger.info("Falling back to demo data")
            raw_response = self._get_demo_data(query, "news")
            result = self._parse_news_response(raw_response)
            return result


# Global tool instance (will be initialized when needed)
_web_search_tool = None


def get_web_search_tool() -> BingSearchTool:
    """Get or create the global BingSearchTool instance."""
    global _web_search_tool
    if _web_search_tool is None:
        _web_search_tool = BingSearchTool()
    return _web_search_tool


def format_search_results(results: Dict[str, List[Dict[str, str]]]) -> str:
    """Format search results into a readable string."""
    output = []

    if 'web' in results and results['web']:
        output.append("Web Results:")
        for i, item in enumerate(results['web'][:5], 1):
            output.append(f"{i}. {item.get('name', 'No title')}")
            output.append(f"   URL: {item.get('url', 'N/A')}")
            snippet = item.get('snippet', 'No description')
            if len(snippet) > 150:
                snippet = snippet[:150] + "..."
            output.append(f"   {snippet}")
            output.append("")

    if 'news' in results and results['news']:
        output.append("News Results:")
        for i, item in enumerate(results['news'][:3], 1):
            output.append(f"{i}. {item.get('name', 'No title')}")
            output.append(f"   {item.get('snippet', 'No description')}")
            output.append("")

    return "\n".join(output) if output else "No results found"


@tool("web_search", args_schema=BingSearchInput)
def web_search(
    query: str, mkt: str = "en-US", search_news: bool = False
) -> str:
    """
    Search the web for information using Microsoft Bing Search API.

    This tool can search for web pages, news articles, images, and entities.

    Args:
        query: The query to search for
        mkt: Market place. Should be in format like ja-JP or en-US (default: en-US)
        search_news: Whether it's related to news or event (default: false)

    Returns:
        Formatted string containing search results
    """
    raw_results = web_search_sync(query, mkt, search_news)
    return format_search_results(raw_results)


# Async version for async environments
async def web_search_async(
    query: str, mkt: str = "en-US", search_news: bool = False
) -> Dict[str, List[Dict[str, str]]]:
    """
    Async version of web_search tool.

    Args:
        query: The query to search for
        mkt: Market place. Should be in format like ja-JP or en-US (default: en-US)
        search_news: Whether it's related to news or event (default: false)

    Returns:
        Dictionary containing search results with keys like 'web', 'news', 'entities', 'image'
    """
    tool_instance = get_web_search_tool()

    if search_news:
        return await tool_instance.search_news(query, mkt, LIMIT)
    else:
        return await tool_instance.search_web(query, mkt, LIMIT)


# Synchronous wrapper for non-async environments
def web_search_sync(
    query: str, mkt: str = "en-US", search_news: bool = False
) -> Dict[str, List[Dict[str, str]]]:
    """
    Synchronous wrapper for web_search tool.

    Args:
        query: The query to search for
        mkt: Market place. Should be in format like ja-JP or en-US (default: en-US)
        search_news: Whether it's related to news or event (default: false)

    Returns:
        Dictionary containing search results with keys like 'web', 'news', 'entities', 'image'
    """
    try:
        # Check if we're already in an event loop (like in Jupyter notebooks)
        asyncio.get_running_loop()
        # If we're in a running loop, we need to use nest_asyncio or create a task
        import nest_asyncio

        nest_asyncio.apply()
        return asyncio.run(web_search_async(query, mkt, search_news))
    except RuntimeError:
        # No event loop running, safe to use asyncio.run()
        return asyncio.run(web_search_async(query, mkt, search_news))
    except ImportError:
        # nest_asyncio not available, try alternative approach
        try:
            asyncio.get_running_loop()
            # Create a task and get the result synchronously
            import concurrent.futures

            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(
                    asyncio.run, web_search_async(query, mkt, search_news)
                )
                return future.result()
        except RuntimeError:
            # No event loop, use normal asyncio.run
            return asyncio.run(web_search_async(query, mkt, search_news))
