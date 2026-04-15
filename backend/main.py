"""
FastAPI backend for Rakuten AI Demo.
General-purpose agent with web_search, memory_tool, and user_input tools.
"""

import asyncio
import json
import logging
import sys
import traceback
import uuid
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from langchain_core.messages import AIMessage

load_dotenv()

from agent.graph import build_graph  # noqa: E402
from agent.prompt import AGENT_PROMPT  # noqa: E402

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)

# Global session store
sessions: dict[str, dict] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting Rakuten AI Demo Backend...")
    print("✅ General-purpose agent ready (web_search, memory_tool, user_input, show_widget)")
    yield
    print("👋 Shutting down...")


app = FastAPI(title="Rakuten AI Demo", lifespan=lifespan)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "type": type(exc).__name__},
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None
    agent_type: str = "rakuten_ai"
    language: str = "en"
    image: str | None = None
    image_media_type: str | None = None


def get_or_create_session(session_id: str | None, language: str = "en") -> tuple[str, dict]:
    """Get an existing session or create a new one."""
    if session_id and session_id in sessions:
        session = sessions[session_id]
        if session.get("language") != language:
            session["language"] = language
            session["config"]["configurable"]["language"] = language
            session["agent_executor"] = build_graph(language=language)
        return session_id, session

    new_id = session_id or str(uuid.uuid4())
    logger.info(f"Creating session {new_id} (language={language})")

    sessions[new_id] = {
        "agent_executor": build_graph(language=language),
        "language": language,
        "tool_store": {},
        "config": {
            "configurable": {
                "thread_id": new_id,
                "language": language,
            },
            "recursion_limit": 50,
        },
    }
    return new_id, sessions[new_id]


def parse_tool_result(tool_name: str, content) -> dict | None:
    """Parse tool result into a structured dict for the frontend."""
    try:
        data = None

        if isinstance(content, dict):
            data = content
        elif isinstance(content, str):
            try:
                data = json.loads(content)
            except json.JSONDecodeError:
                return {"type": "text", "content": content, "tool_name": tool_name}
        else:
            return {"type": "text", "content": str(content), "tool_name": tool_name}

        if data is None:
            return {"type": "text", "content": str(content), "tool_name": tool_name}

        # user_input / show_widget — pass through to frontend for native rendering
        if isinstance(data, dict) and data.get("type") == "ui_resource":
            result = {"type": "ui_resource", "tool_name": tool_name}
            if "form_data" in data:
                result["form_data"] = data["form_data"]
            if "summary" in data:
                result["summary"] = data["summary"]
            if "_handle" in data:
                result["_handle"] = data["_handle"]
            if "question_count" in data:
                result["question_count"] = data["question_count"]
            if "widget_type" in data:
                result["widget_type"] = data["widget_type"]
            if "html" in data:
                result["widget_html"] = data["html"]
            return result

        # memory_tool / web_search — return as generic object
        if isinstance(data, dict):
            return {"type": "object", "data": data, "tool_name": tool_name}

        return {"type": "text", "content": str(content), "tool_name": tool_name}

    except Exception as e:
        logger.error(f"Error parsing tool result for {tool_name}: {e}")
        return None


async def stream_chat_response(session_id: str, session: dict, message: str,
                               image: str | None = None, image_media_type: str | None = None):
    """Stream agent response as SSE events."""
    agent_executor = session["agent_executor"]
    config = session["config"]
    tool_store = session["tool_store"]

    if image and image_media_type:
        input_message = {
            "role": "user",
            "content": [
                {"type": "text", "text": message or "What's in this image?"},
                {"type": "image_url", "image_url": {"url": f"data:{image_media_type};base64,{image}"}},
            ],
        }
    else:
        input_message = {"role": "user", "content": message}
    current_run_id = None
    active_tool_calls: dict[str, dict] = {}

    try:
        # Emit system prompt as first debug event
        yield f"data: {json.dumps({'type': 'debug', 'debug_type': 'system_prompt', 'content': AGENT_PROMPT})}\n\n"
        await asyncio.sleep(0)

        async for event in agent_executor.astream_events(
            {"messages": [input_message]},
            config,
            version="v2",
        ):
            event_type = event.get("event")

            # Stream LLM tokens
            if event_type == "on_chat_model_stream":
                chunk = event.get("data", {}).get("chunk")
                if not chunk:
                    continue

                content = None

                # Models that use content_blocks (Claude)
                if hasattr(chunk, "content_blocks") and chunk.content_blocks:
                    for block in chunk.content_blocks:
                        if isinstance(block, dict) and block.get("type") == "text":
                            content = block.get("text", "")
                # Models that use chunk.content directly (OpenAI)
                elif hasattr(chunk, "content") and isinstance(chunk.content, str):
                    content = chunk.content

                if content:
                    run_id = event.get("run_id")
                    if run_id != current_run_id:
                        current_run_id = run_id
                        yield f"data: {json.dumps({'type': 'message_start', 'session_id': session_id})}\n\n"
                        await asyncio.sleep(0)

                    yield f"data: {json.dumps({'type': 'token', 'content': content})}\n\n"
                    await asyncio.sleep(0)

            # Notify frontend when a tool call is dispatched
            elif event_type == "on_chat_model_end":
                msg = event.get("data", {}).get("output")
                if isinstance(msg, AIMessage) and getattr(msg, "tool_calls", None):
                    for tc in msg.tool_calls:
                        yield f"data: {json.dumps({'type': 'tool_call', 'tool_name': tc.get('name', 'unknown'), 'args': tc.get('args', {})})}\n\n"
                        await asyncio.sleep(0)

            # Track tool execution start
            elif event_type == "on_tool_start":
                tool_name = event.get("name", "")
                run_id = event.get("run_id", "")
                tool_input = event.get("data", {}).get("input", {})
                if tool_name:
                    active_tool_calls[run_id] = {"tool_name": tool_name, "input": tool_input}

            # Handle tool errors
            elif event_type in ("on_tool_error", "on_chain_error"):
                run_id = event.get("run_id", "")
                error = event.get("data", {}).get("error")
                tool_name = event.get("name") or (active_tool_calls.get(run_id, {}).get("tool_name", "unknown"))
                yield f"data: {json.dumps({'type': 'tool_error', 'tool_name': tool_name, 'error': str(error) if error else 'Unknown error', 'run_id': run_id})}\n\n"
                await asyncio.sleep(0)
                active_tool_calls.pop(run_id, None)

            # Handle tool results
            elif event_type == "on_tool_end":
                tool_name = event.get("name", "")
                run_id = event.get("run_id", "")
                output = event.get("data", {}).get("output")
                active_tool_calls.pop(run_id, None)

                if not tool_name:
                    continue

                # Extract content
                output_content = getattr(output, "content", output) if output else None
                is_error = getattr(output, "status", None) == "error"

                if output_content is None or is_error:
                    yield f"data: {json.dumps({'type': 'tool_error', 'tool_name': tool_name, 'error': str(output_content or 'No output'), 'run_id': run_id})}\n\n"
                    await asyncio.sleep(0)
                    continue

                # Try to parse JSON strings back to dicts
                if isinstance(output_content, str):
                    try:
                        parsed_content = json.loads(output_content)
                        if isinstance(parsed_content, dict):
                            output_content = parsed_content
                    except (json.JSONDecodeError, ValueError):
                        pass

                parsed = parse_tool_result(tool_name, output_content)
                if parsed:
                    # Generate a handle key for the tool store
                    prefix = tool_name.replace("_", "")
                    count = len([k for k in tool_store if k.startswith(f"{prefix}_")]) + 1
                    handle_key = f"{prefix}_{count}"
                    tool_store[handle_key] = parsed

                    yield f"data: {json.dumps({'type': 'tool_result', 'handle': handle_key, 'tool_name': tool_name, 'data': parsed})}\n\n"
                    await asyncio.sleep(0)

        # Done
        yield f"data: {json.dumps({'type': 'done', 'session_id': session_id, 'tool_store': tool_store})}\n\n"
        await asyncio.sleep(0)

    except Exception as e:
        logger.error(f"Error in stream_chat_response: {e}")
        logger.error(traceback.format_exc())
        yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
        await asyncio.sleep(0)


@app.post("/chat")
async def chat(request: ChatRequest):
    session_id, session = get_or_create_session(request.session_id, request.language)
    return StreamingResponse(
        stream_chat_response(session_id, session, request.message,
                             image=request.image, image_media_type=request.image_media_type),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
            "X-Session-ID": session_id,
        },
    )


@app.get("/agents")
async def get_agents():
    return {"agents": ["rakuten_ai"]}


@app.get("/session/{session_id}/tool-store")
async def get_tool_store(session_id: str):
    if session_id not in sessions:
        return {"error": "Session not found", "tool_store": {}}
    return {"tool_store": sessions[session_id]["tool_store"]}


@app.delete("/session/{session_id}")
async def delete_session(session_id: str):
    if session_id in sessions:
        del sessions[session_id]
        return {"status": "deleted"}
    return {"status": "not_found"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
