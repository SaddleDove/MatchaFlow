#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

EXPOSE_PORT=$(awk -F '[ =]+' '/^expose_port/ {gsub(/[^0-9]/, "", $2); print $2; exit}' .preview 2>/dev/null || echo 5000)

fuser -k "${EXPOSE_PORT}/tcp" 2>/dev/null || true
sleep 1

source .venv/bin/activate
export PORT="$EXPOSE_PORT"

exec python -m uvicorn api.main:app --host 0.0.0.0 --port "$EXPOSE_PORT"
