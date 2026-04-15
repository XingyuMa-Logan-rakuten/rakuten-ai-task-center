# Rakuten AI Demo

A full-stack AI chat demo with a general-purpose LangGraph agent and a Rakuten-styled React frontend.

## Prerequisites

- Python 3.11+
- Node.js 18+
- An OpenAI API key (gpt-4o)

## Setup

Create a `.env` file in the project root:

```
OPENAI_API_KEY=sk-...
BING_SEARCH_SUBSCRIPTION_KEY=...   # optional, enables web_search tool
```

## Start

```bash
bash start.sh
```

This will:
1. Create a Python virtualenv in `backend/.venv` and install dependencies
2. Start the FastAPI backend on **http://localhost:8000**
3. Install frontend npm dependencies if needed
4. Start the Vite dev server on **http://localhost:3001**

Press `Ctrl+C` to stop both servers.

## Tools

| Tool | Description |
|---|---|
| `web_search` | Searches the web via Bing (requires `BING_SEARCH_SUBSCRIPTION_KEY`) |
| `memory_tool` | Retrieves user behavioral and conversational memory |
| `user_input` | Renders a native form in the chat to collect structured input |
| `show_widget` | Renders a custom HTML widget (`.elicit` class system) inline in the chat |

## Structure

```
rakuten-ai-demo/
├── start.sh          # single command to start everything
├── .env              # API keys (not committed)
├── backend/
│   ├── main.py       # FastAPI + SSE streaming
│   ├── config.py     # env config
│   ├── agent/
│   │   ├── graph.py  # LangGraph create_react_agent
│   │   └── prompt.py # system prompt
│   └── tools/        # web_search, memory_tool, user_input, show_widget
└── frontend/
    └── src/
        ├── components/  # ChatView, WidgetRenderer, NativeUserInputForm, …
        ├── hooks/       # useStreaming
        └── types.ts
```
