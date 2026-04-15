#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_ROOT="${WEB_ROOT:-/var/www/report-platform}"

RESET_DATA=0
SKIP_PULL=0

usage() {
  cat <<'EOF'
Usage:
  bash deploy.sh [--reset-data] [--skip-pull]

Options:
  --reset-data  Stop containers and remove project volumes (DB and report artifacts).
  --skip-pull   Skip git pull step.
  -h, --help    Show this help message.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --reset-data)
      RESET_DATA=1
      shift
      ;;
    --skip-pull)
      SKIP_PULL=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ "${EUID}" -ne 0 ]]; then
  echo "Please run as root (required for nginx reload and /var/www write)." >&2
  exit 1
fi

for cmd in git docker nginx systemctl curl; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Missing command: $cmd" >&2
    exit 1
  fi
done

cd "${ROOT_DIR}"

if [[ ! -f ".env" ]]; then
  if [[ -f ".env.example" ]]; then
    cp .env.example .env
    echo "Created .env from .env.example. Fill secrets in .env and run again." >&2
    exit 1
  fi

  echo ".env file not found." >&2
  exit 1
fi

echo "[1/8] Stopping current containers..."
if [[ "${RESET_DATA}" -eq 1 ]]; then
  docker compose down -v --remove-orphans
else
  docker compose down --remove-orphans
fi

echo "[2/8] Cleaning docker caches..."
docker builder prune -af
docker image prune -af
docker container prune -f
docker network prune -f

if [[ "${SKIP_PULL}" -eq 0 ]]; then
  echo "[3/8] Updating repository..."
  git pull --ff-only
else
  echo "[3/8] Skipping git pull."
fi

echo "[4/8] Building backend image..."
docker compose build api

echo "[5/8] Reusing backend image for init/worker..."
docker tag report-platform-api:latest report-platform-init:latest
docker tag report-platform-api:latest report-platform-worker:latest
docker compose up -d --no-build

echo "[6/8] Building frontend..."
docker run --rm -v "${ROOT_DIR}:/app" -w /app node:22-alpine sh -lc \
  "corepack enable && pnpm install --frozen-lockfile && pnpm --filter @report-platform/web build"

echo "[7/8] Publishing frontend to ${WEB_ROOT}..."
mkdir -p "${WEB_ROOT}"
rm -rf "${WEB_ROOT:?}"/*
cp -r apps/web/dist/. "${WEB_ROOT}/"

echo "[8/8] Reloading nginx and checking health..."
nginx -t
systemctl reload nginx
docker compose ps
curl -fsS http://127.0.0.1:3000/api/reports >/dev/null

echo "Deploy completed successfully."
