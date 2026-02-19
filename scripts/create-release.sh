#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-$(node -p "require('./package.json').version")}" 
OUT_DIR="releases"
ARCHIVE_NAME="absolute-zero-forge-ai-${VERSION}.tar.gz"

mkdir -p "${OUT_DIR}"

# Build release artifact from git-tracked files only.
git archive --format=tar.gz --output="${OUT_DIR}/${ARCHIVE_NAME}" HEAD

echo "Created ${OUT_DIR}/${ARCHIVE_NAME}"
