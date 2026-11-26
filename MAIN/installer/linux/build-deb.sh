#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT"

command -v dpkg-deb >/dev/null || {
  echo "dpkg-deb is required to build CIN.deb." >&2
  exit 1
}
command -v zip >/dev/null || {
  echo "zip is required to build the CIN Linux installer archive." >&2
  exit 1
}
command -v sha256sum >/dev/null || {
  echo "sha256sum is required to generate the package checksum." >&2
  exit 1
}

PACKAGE_ROOT="MAIN/packaging/deb"
OUTPUT_DIR="${1:-dist}"
OUTPUT_PATH="$OUTPUT_DIR/CIN.deb"
BUNDLE_DIR="$OUTPUT_DIR/CIN-Linux-Installer"
BUNDLE_PATH="$OUTPUT_DIR/CIN-Linux-Installer.zip"

# Never allow files from a previous build to leak into the new package.
rm -rf "$PACKAGE_ROOT/opt" "$PACKAGE_ROOT/usr" "$OUTPUT_DIR"
install -d "$PACKAGE_ROOT/opt/cin-main-lobby" "$OUTPUT_DIR" "$BUNDLE_DIR"

install -m 0644 MAIN/app/launcher/cin_main.py "$PACKAGE_ROOT/opt/cin-main-lobby/cin_main.py"
cp -a MAIN/app/settings "$PACKAGE_ROOT/opt/cin-main-lobby/"

# Compile every shipped Python module before producing a distributable archive.
python3 -m compileall -q "$PACKAGE_ROOT/opt/cin-main-lobby"

dpkg-deb --build --root-owner-group "$PACKAGE_ROOT" "$OUTPUT_PATH"

install -m 0755 MAIN/installer/linux/install-user.sh "$BUNDLE_DIR/install-user.sh"
install -m 0755 MAIN/installer/linux/uninstall-user.sh "$BUNDLE_DIR/uninstall-user.sh"
install -m 0644 "$OUTPUT_PATH" "$BUNDLE_DIR/CIN.deb"
cat > "$BUNDLE_DIR/README.txt" <<'EOF'
CIN — Core Identification Nodes byLAEV
Linux user-space installer

Install as the normal desktop user (never with sudo or dpkg -i):
  bash install-user.sh ./CIN.deb

Launch:
  ~/.local/bin/cin-main

Uninstall:
  bash uninstall-user.sh

Python 3, PyGObject, GTK 4, OpenSSL and dpkg-deb must already be available.
The installer writes application files only inside the current user's home.
EOF
(
  cd "$BUNDLE_DIR"
  sha256sum CIN.deb install-user.sh uninstall-user.sh README.txt > SHA256SUMS
)
(
  cd "$OUTPUT_DIR"
  zip -qr CIN-Linux-Installer.zip CIN-Linux-Installer
)

# Verify the exact final archive and the Debian payload before returning success.
unzip -t "$BUNDLE_PATH"
dpkg-deb --info "$OUTPUT_PATH"
dpkg-deb --contents "$OUTPUT_PATH"
printf '\nSingle distributable created: %s\n' "$BUNDLE_PATH"
