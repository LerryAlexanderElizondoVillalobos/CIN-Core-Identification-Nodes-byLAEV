#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT"
[[ "$(uname -m)" == "aarch64" || "$(uname -m)" == "arm64" ]] || {
  echo "Build CIN Debian 13 ARM64 on an AArch64 runner." >&2; exit 2;
}
APPDIR="$ROOT/build/appimage/AppDir"
[[ -x "$APPDIR/AppRun" && -x "$APPDIR/usr/bin/cin-main" ]] || {
  echo "Missing AppDir. Run MAIN/installer/linux/build-appimage.sh first." >&2; exit 1;
}
for tool in dpkg-deb zip sha256sum; do
  command -v "$tool" >/dev/null || { echo "Missing build dependency: $tool" >&2; exit 1; }
done

VERSION="0.5.0"
PKG="$ROOT/build/debian13-package"
BUNDLE="$ROOT/build/CIN-Debian13-Installer"
DIST="$ROOT/dist"
rm -rf "$PKG" "$BUNDLE"
mkdir -p "$PKG/DEBIAN" "$PKG/opt/cin/AppDir" "$BUNDLE" "$DIST"
cp -a "$APPDIR/." "$PKG/opt/cin/AppDir/"
# The Debian edition does not ship the AppImage first-run installer. Removing
# its PyInstaller runtime keeps the native .deb smaller and avoids dead code.
rm -rf "$PKG/opt/cin/AppDir/usr/lib/cin-appimage-installer"
rm -f "$PKG/opt/cin/AppDir/usr/bin/cin-appimage-installer"
# Embed the user-space bootstrap in the .deb so the single archive is sufficient.
mkdir -p "$PKG/opt/cin-installer"
install -m 0755 MAIN/installer/debian13/install-user.sh "$PKG/opt/cin-installer/install-user.sh"
install -m 0755 MAIN/installer/debian13/uninstall-user.sh "$PKG/opt/cin-installer/uninstall-user.sh"
install -m 0755 MAIN/installer/debian13/run-user.sh "$PKG/opt/cin-installer/run-user.sh"
install -m 0644 MAIN/installer/debian13/README.md "$PKG/opt/cin-installer/README.md"
cat > "$PKG/opt/cin/AppDir/AppRun" <<'APP_RUN'
#!/bin/sh
set -eu
HERE="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
export LD_LIBRARY_PATH="$HERE/usr/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
export GI_TYPELIB_PATH="$HERE/usr/lib/girepository-1.0${GI_TYPELIB_PATH:+:$GI_TYPELIB_PATH}"
export GTK_PATH="$HERE/usr/lib/gtk-4.0${GTK_PATH:+:$GTK_PATH}"
export GSETTINGS_SCHEMA_DIR="$HERE/usr/share/glib-2.0/schemas"
if [ "${1:-}" = "--run" ]; then shift; fi
if command -v systemd-run >/dev/null 2>&1 && systemctl --user show-environment >/dev/null 2>&1; then
  if systemd-run --user --scope --unit=cin-main-lobby -- "$HERE/usr/bin/cin-main" "$@"; then
    exit 0
  fi
fi
exec "$HERE/usr/bin/cin-main" "$@"
APP_RUN
chmod 0755 "$PKG/opt/cin/AppDir/AppRun" "$PKG/opt/cin/AppDir/usr/bin/cin-main"

cat > "$PKG/DEBIAN/control" <<EOF
Package: core-identification-nodes
Version: $VERSION
Section: utils
Priority: optional
Architecture: arm64
Depends: libc6 (>= 2.36), libstdc++6, libgcc-s1
Maintainer: LAEV <lerryalexelizondo@users.noreply.github.com>
Description: Core Identification Nodes Main Lobby for Debian 13 ARM64
 CIN Main Lobby and its relocatable GTK runtime. This package is designed
 to be extracted into a user's home directory by the included installer.
 It does not require dpkg -i, root privileges, or system-wide installation.
EOF

dpkg-deb --root-owner-group --build "$PKG" "$DIST/CIN.deb"
test "$(dpkg-deb -f "$DIST/CIN.deb" Package)" = "core-identification-nodes"
test "$(dpkg-deb -f "$DIST/CIN.deb" Architecture)" = "arm64"
test "$(dpkg-deb -f "$DIST/CIN.deb" Version)" = "$VERSION"

cp "$DIST/CIN.deb" "$BUNDLE/CIN.deb"
install -m 0755 MAIN/installer/debian13/install-user.sh "$BUNDLE/install-user.sh"
install -m 0755 MAIN/installer/debian13/uninstall-user.sh "$BUNDLE/uninstall-user.sh"
install -m 0644 MAIN/installer/debian13/README.md "$BUNDLE/README.md"
install -m 0755 MAIN/installer/debian13/run-user.sh "$BUNDLE/run-user.sh"
cat > "$BUNDLE/PACKAGE-MANIFEST.txt" <<EOF
CIN Debian 13 — User Space Edition
Package: CIN.deb
Version: $VERSION
Target: Debian GNU/Linux 13 (Trixie), ARM64/AArch64
Install: ./install-user.sh (ordinary user; no sudo/root; no dpkg -i)
Uninstall: ./uninstall-user.sh or ~/.local/bin/cin-uninstall
The Debian package is extracted with dpkg-deb -x into the user's home directory.
No system package database or system-wide directories are modified.
EOF

(
  cd "$ROOT/build"
  zip -qr "$DIST/CIN-Debian13-Installer.zip" "CIN-Debian13-Installer"
)
(
  cd "$DIST"
  sha256sum CIN.deb CIN-Debian13-Installer.zip > SHA256SUMS
)
dpkg-deb --info "$DIST/CIN.deb"
dpkg-deb --contents "$DIST/CIN.deb" > "$DIST/CIN.deb.contents.txt"
head -n 30 "$DIST/CIN.deb.contents.txt"
sha256sum "$DIST/CIN.deb" "$DIST/CIN-Debian13-Installer.zip"
