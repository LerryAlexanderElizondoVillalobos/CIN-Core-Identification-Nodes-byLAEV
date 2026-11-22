#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
RUNTIME="$ROOT/Main/core/runtime/cin_main.py"
INSTALLER="$ROOT/Main/installation/linux/install.sh"
UNINSTALLER="$ROOT/Main/installation/linux/uninstall.sh"
PACKAGE="$ROOT/Main/installation/linux/package-portable.sh"
bash -n "$INSTALLER"
bash -n "$UNINSTALLER"
bash -n "$PACKAGE"
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
if command -v cargo >/dev/null 2>&1; then
  (cd "$ROOT/Main/runtime/linux-portable" && cargo test)
  (cd "$ROOT/Main/core/domain" && cargo test)
fi
(cd "$ROOT/Main/services/cin-local-backend" && npm test)
node --check "$ROOT/Main/installation/android-termux/src/server.js"
node --check "$ROOT/Main/installation/android-termux/src/github/oauth.js"
node --check "$ROOT/Main/installation/android-termux/src/github/connector.js"
node --check "$ROOT/Main/installation/android-termux/src/authorization/permission-engine.js"
node --check "$ROOT/Main/installation/android-termux/src/signatures/signature-interface.js"
node --check "$ROOT/Main/installation/android-termux/src/workspace/local-directory.js"
python3 "$ROOT/Main/core/module-manager/test-module-manager.py"
echo "CIN Main smoke checks passed."
