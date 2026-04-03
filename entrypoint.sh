#!/bin/sh
set -e

# Inject Supabase (and optional backend) public config for the SPA — Vite only bakes env at build time;
# this lets Docker pass secrets at runtime without rebuilding the frontend.
write_frontend_env_js() {
  HTML_ROOT="/usr/share/nginx/html"
  if [ ! -d "$HTML_ROOT" ]; then
    return 0
  fi
  python3 <<'PY'
import json
import os
from pathlib import Path

out = Path("/usr/share/nginx/html/env.js")
payload = {
    "VITE_SUPABASE_URL": os.environ.get("VITE_SUPABASE_URL", "") or "",
    "VITE_SUPABASE_ANON_KEY": os.environ.get("VITE_SUPABASE_ANON_KEY", "") or "",
    "VITE_BACKEND_URL": os.environ.get("VITE_BACKEND_URL", "") or "",
}
# Merge with any stub from the image so we only override known keys
out.write_text(
    "window.__ENV__=window.__ENV__||{};Object.assign(window.__ENV__,"
    + json.dumps(payload)
    + ");",
    encoding="utf-8",
)
PY
  echo "Wrote runtime env.js for SPA (merge public keys from container env)."
}

write_frontend_env_js

# Start the FastAPI backend
cd /backend || { echo "Backend directory not found"; exit 1; }

echo "Starting FastAPI backend"
# Start Uvicorn with proper host binding
uvicorn server:app --host 0.0.0.0 --port 8001 &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 30

if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "Backend failed to start at initialization, exiting"
    exit 1
fi

# Start Nginx
nginx -g 'daemon off;' &
NGINX_PID=$!

# Handle termination signals
trap 'kill $BACKEND_PID $NGINX_PID; exit 0' SIGTERM SIGINT

# Check if processes are still running
while kill -0 $BACKEND_PID 2>/dev/null && kill -0 $NGINX_PID 2>/dev/null; do
    sleep 1
done

# If we get here, one of the processes died
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo "Nginx died, shutting down backend..."
    kill $BACKEND_PID
else
    echo "Backend died, shutting down nginx..."
    kill $NGINX_PID
fi

exit 1
