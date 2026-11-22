#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
RUNTIME="$ROOT/Main/core/runtime/cin_main.py"
INSTALLER="$ROOT/Main/installation/linux/install.sh"
UNINSTALLER="$ROOT/Main/installation/linux/uninstall.sh"
bash -n "$INSTALLER"
bash -n "$UNINSTALLER"
python3 "$RUNTIME" --help >/dev/null
python3 "$RUNTIME" status >/dev/null
TMP_CONFIG="$(mktemp)"
rm -f "$TMP_CONFIG"
python3 "$RUNTIME" --config "$TMP_CONFIG" init
python3 - "$TMP_CONFIG" <<'PY'
import json,sys
from pathlib import Path
config=json.loads(Path(sys.argv[1]).read_text())
assert config["runtime"]["service_name"] == "cin-main"
assert config["installation"]["client"] == "lindesk-android"
PY
rm -f "$TMP_CONFIG"
echo "CIN Main smoke checks passed."
