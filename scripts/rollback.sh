#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <image-tag>" >&2
  exit 1
fi

TAG="$1"
REPO_DIR="${REPO_DIR:-/opt/domotic}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.yml}"
if [ ! -d "$REPO_DIR" ]; then
  echo "Repository directory $REPO_DIR not found" >&2
  exit 1
fi

cd "$REPO_DIR"

export BACKEND_TAG="$TAG"
export FRONTEND_TAG="$TAG"

echo "Rolling back to tag $TAG using compose file $COMPOSE_FILE"
docker compose -f "$COMPOSE_FILE" pull app frontend

docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

echo "Rollback complete. Current images:"
docker compose -f "$COMPOSE_FILE" images
