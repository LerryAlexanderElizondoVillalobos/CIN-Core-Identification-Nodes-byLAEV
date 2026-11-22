#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
command -v node >/dev/null 2>&1 || { echo "Node.js is required in Termux. Install it with: pkg install nodejs" >&2; exit 1; }
node -e 'const v=process.versions.node.split(".").map(Number); if(v[0]<20) process.exit(1)' || { echo "Node.js 20 or newer is required." >&2; exit 1; }
cd "$HERE"
if [[ ! -f .env ]]; then cp .env.example .env; echo "Created .env. Edit it with your local settings before launching."; fi
npm run check
echo "Termux integration prepared. Launch with: npm start"
