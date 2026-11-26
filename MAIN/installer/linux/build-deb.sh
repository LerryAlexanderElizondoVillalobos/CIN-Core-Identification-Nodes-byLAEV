#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT"

command -v dpkg-deb >/dev/null || {
  echo "dpkg-deb is required. Install the Debian dpkg package." >&2
  exit 1
}

PACKAGE_ROOT="MAIN/packaging/deb"
OUTPUT_DIR="${1:-dist}"
OUTPUT_PATH="$OUTPUT_DIR/CIN.deb"

chmod 0755 "$PACKAGE_ROOT/usr/bin/cin-main"
chmod 0755 "$PACKAGE_ROOT/DEBIAN/postinst"
chmod 0755 "$PACKAGE_ROOT/DEBIAN/postrm"
install -d "$PACKAGE_ROOT/usr/lib/cin-main-lobby" "$OUTPUT_DIR"
install -m 0644 MAIN/app/launcher/cin_main.py "$PACKAGE_ROOT/usr/lib/cin-main-lobby/cin_main.py"

dpkg-deb --build --root-owner-group "$PACKAGE_ROOT" "$OUTPUT_PATH"
dpkg-deb --info "$OUTPUT_PATH"
dpkg-deb --contents "$OUTPUT_PATH"

printf '\nPackage created: %s\n' "$OUTPUT_PATH"
