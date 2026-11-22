#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../../.." && pwd)"
BIN="${1:-$ROOT/Main/runtime/linux-portable/target/release/cin-linux-main}"
OUT="$ROOT/dist"
STAGE="$OUT/CIN-Linux-Portable-x86_64"
test -x "$BIN" || { echo "Executable not found: $BIN" >&2; exit 1; }
rm -rf "$STAGE"
mkdir -p "$STAGE"
install -m 0755 "$BIN" "$STAGE/cin"
cat > "$STAGE/run-cin.sh" <<'LAUNCH'
#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
exec "$HERE/cin" "$@"
LAUNCH
chmod 0755 "$STAGE/run-cin.sh"
cp "$ROOT/Main/runtime/linux-portable/README.md" "$STAGE/README.md"
cat > "$STAGE/PACKAGE-MANIFEST.txt" <<'MANIFEST'
CIN Main Linux Portable Local Web Runtime
Version: 0.2.0
Target: Linux x86_64
Launch entry point: ./run-cin.sh
Local interface: loopback only (ports 1221, 2112, fallback dynamic)
Runtime: Rust standard-library HTTP server
Data: outside package by default
Unsigned development package; not a production CIN release.
MANIFEST
mkdir -p "$OUT"
(cd "$OUT" && zip -qr "CIN-Linux-Portable-x86_64.zip" "CIN-Linux-Portable-x86_64")
(cd "$OUT" && sha256sum "CIN-Linux-Portable-x86_64.zip" > "CIN-Linux-Portable-x86_64.zip.sha256")
echo "Created $OUT/CIN-Linux-Portable-x86_64.zip"
