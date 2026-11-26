#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
APPDIR="$ROOT/build/appimage/AppDir"
OUT="$ROOT/dist"
STAGE="$ROOT/build/CIN-Linux-ARM64-Portable"

ARCH="$(uname -m)"
case "$ARCH" in
  aarch64|arm64) ;;
  *) printf 'Build this portable archive on ARM64; detected: %s\n' "$ARCH" >&2; exit 2 ;;
esac

test -x "$APPDIR/AppRun"
test -x "$APPDIR/usr/bin/cin-main"
rm -rf "$STAGE"
mkdir -p "$STAGE/AppDir" "$OUT"
cp -a "$APPDIR/." "$STAGE/AppDir/"
install -m 0755 "$ROOT/MAIN/installer/linux-portable/run-cin.sh" "$STAGE/run-cin.sh"
install -m 0755 "$ROOT/MAIN/installer/linux-portable/install.sh" "$STAGE/install.sh"
install -m 0644 "$ROOT/MAIN/installer/linux-portable/README.md" "$STAGE/README.md"

printf '%s\n' \
  'Core Identification Nodes - Linux ARM64 Portable' \
  'Target: Linux ARM64 / AArch64, Debian/glibc userspace' \
  'Primary Android-hosted Linux target: LinDesk (Debian-based)' \
  'Install: ./install.sh (current user only; no sudo/root)' \
  'Run without installing: ./run-cin.sh' \
  'Uninstall: ~/.local/bin/cin-uninstall' \
  'No AppImage mount, FUSE, VM, or system-wide package installation is required.' \
  > "$STAGE/PACKAGE-MANIFEST.txt"

tar -C "$ROOT/build" -czf "$OUT/CIN-Linux-ARM64-Portable.tar.gz" "CIN-Linux-ARM64-Portable"
(
  cd "$OUT"
  sha256sum CIN-Linux-ARM64-Portable.tar.gz > CIN-Linux-ARM64-Portable.tar.gz.sha256
)
tar -tzf "$OUT/CIN-Linux-ARM64-Portable.tar.gz" | grep -q '^CIN-Linux-ARM64-Portable/AppDir/AppRun$'
test -s "$OUT/CIN-Linux-ARM64-Portable.tar.gz"
sha256sum "$OUT/CIN-Linux-ARM64-Portable.tar.gz"
