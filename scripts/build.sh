#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

echo "==> Installing frontend dependencies..."
cd frontend
pnpm install --frozen-lockfile

echo "==> Building frontend..."
pnpm run build

echo "==> Installing backend dependencies..."
cd "$PROJECT_DIR"
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
pip install -q -r api/requirements.txt
pip install -q -r requirements.txt

echo "==> Build complete."
