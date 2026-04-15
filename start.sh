#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

echo "🚀 Starting Rakuten AI Demo"
echo "────────────────────────────────────────"

# Kill existing processes on used ports
kill_port() {
  local port=$1
  local pid=$(lsof -ti:$port 2>/dev/null)
  if [ ! -z "$pid" ]; then
    echo "🧹 Killing existing process on port $port"
    kill -9 $pid 2>/dev/null || true
    sleep 0.5
  fi
}
kill_port 8000
kill_port 3001

# Set up backend virtualenv
cd "$BACKEND_DIR"
if [ ! -d ".venv" ]; then
  echo "🐍 Creating Python virtual environment..."
  python3 -m venv .venv
fi
source .venv/bin/activate

# Install / sync requirements
echo "📦 Checking backend dependencies..."
pip install -q -r requirements.txt

# Check .env
if [ ! -f "$SCRIPT_DIR/.env" ]; then
  echo "⚠️  Warning: No .env file found at $SCRIPT_DIR/.env"
  echo "   The backend needs OPENAI_API_KEY and optionally BING_SEARCH_SUBSCRIPTION_KEY."
fi

# Copy .env to backend dir so python-dotenv picks it up
if [ -f "$SCRIPT_DIR/.env" ] && [ ! -f "$BACKEND_DIR/.env" ]; then
  cp "$SCRIPT_DIR/.env" "$BACKEND_DIR/.env"
fi

# Start backend
echo "🐍 Starting LangGraph backend on port 8000..."
cd "$BACKEND_DIR"
python main.py &
BACKEND_PID=$!

# Wait for backend
echo "⏳ Waiting for backend to start..."
for i in $(seq 1 60); do
  if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is ready"
    break
  fi
  if [ "$i" -eq 60 ]; then
    echo "❌ Backend failed to start. Check the output above."
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
  fi
  sleep 1
done

# Install frontend deps if needed
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  cd "$FRONTEND_DIR"
  npm install
fi

# Start frontend
echo "⚛️  Starting React frontend on port 3001..."
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "────────────────────────────────────────"
echo "✅ Rakuten AI Demo is running!"
echo "   Frontend: http://localhost:3001"
echo "   Backend:  http://localhost:8000"
echo "   API docs: http://localhost:8000/docs"
echo "────────────────────────────────────────"
echo "Press Ctrl+C to stop"
echo ""

# Cleanup on exit
cleanup() {
  echo ""
  echo "🛑 Stopping servers..."
  kill $BACKEND_PID 2>/dev/null || true
  kill $FRONTEND_PID 2>/dev/null || true
  echo "Done."
}
trap cleanup EXIT INT TERM

wait $BACKEND_PID $FRONTEND_PID
