#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT"

command -v dpkg-deb >/dev/null || {
  echo "dpkg-deb is required to build CIN.deb." >&2
  exit 1
}

PACKAGE_ROOT="MAIN/packaging/deb"
rm -rf "$PACKAGE_ROOT/usr"
OUTPUT_DIR="${1:-dist}"
OUTPUT_PATH="$OUTPUT_DIR/CIN.deb"

install -d "$PACKAGE_ROOT/opt/cin-main-lobby" "$OUTPUT_DIR"
install -m 0644 MAIN/app/launcher/cin_main.py "$PACKAGE_ROOT/opt/cin-main-lobby/cin_main.py"
if [[ -d MAIN/app/settings ]]; then
  cp -a MAIN/app/settings "$PACKAGE_ROOT/opt/cin-main-lobby/"
fi
dpkg-deb --build --root-owner-group "$PACKAGE_ROOT" "$OUTPUT_PATH"

install -m 0755 MAIN/installer/linux/install-user.sh "$OUTPUT_DIR/install-user.sh"
install -m 0755 MAIN/installer/linux/uninstall-user.sh "$OUTPUT_DIR/uninstall-user.sh"

dpkg-deb --info "$OUTPUT_PATH"
dpkg-deb --contents "$OUTPUT_PATH"
printf '\nUser-space installer bundle created in %s\n' "$OUTPUT_DIR"
