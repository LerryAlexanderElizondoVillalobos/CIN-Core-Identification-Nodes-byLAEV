#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT"
ARCH="$(uname -m)"
if [[ "$ARCH" != "aarch64" && "$ARCH" != "arm64" ]]; then
  echo "CIN Debian package must be built on ARM64; detected: $ARCH" >&2
  exit 2
fi

APPDIR="$ROOT/build/appimage/AppDir"
[[ -x "$APPDIR/AppRun" && -x "$APPDIR/usr/bin/cin-main" ]] || {
  echo "Missing completed AppDir. Build the ARM64 AppImage first." >&2
  exit 1
}
for tool in dpkg-deb desktop-file-validate rsvg-convert; do
  command -v "$tool" >/dev/null || { echo "Missing build dependency: $tool" >&2; exit 1; }
done

PKG="$ROOT/build/deb-arm64"
rm -rf "$PKG"
install -d "$PKG/DEBIAN" "$PKG/opt/cin/AppDir" "$PKG/usr/bin" \
  "$PKG/usr/share/applications" "$PKG/usr/share/icons/hicolor/scalable/apps" \
  "$PKG/usr/share/icons/hicolor/256x256/apps" "$ROOT/dist"

# A native Debian payload: install the same relocatable AppDir tree directly.
# This avoids nesting an AppImage inside the .deb (and avoids a FUSE dependency).
cp -a "$APPDIR/." "$PKG/opt/cin/AppDir/"
test -x "$PKG/opt/cin/AppDir/AppRun"
test -x "$PKG/opt/cin/AppDir/usr/bin/cin-main"

cat > "$PKG/usr/bin/cin-main-lobby" <<'EOF'
#!/bin/sh
set -eu
export APPIMAGE_EXTRACT_AND_RUN=1
exec /opt/cin/AppDir/AppRun --run "$@"
EOF
chmod 0755 "$PKG/usr/bin/cin-main-lobby"

install -m 0644 MAIN/installer/linux/cin-main-lobby.svg \
  "$PKG/usr/share/icons/hicolor/scalable/apps/cin-main-lobby.svg"
rsvg-convert -w 256 -h 256 MAIN/installer/linux/cin-main-lobby.svg \
  -o "$PKG/usr/share/icons/hicolor/256x256/apps/cin-main-lobby.png"

cat > "$PKG/usr/share/applications/cin-main-lobby.desktop" <<'EOF'
[Desktop Entry]
Type=Application
Name=Core Identification Nodes
Comment=CIN Main Lobby
Exec=/usr/bin/cin-main-lobby
Icon=cin-main-lobby
Terminal=false
Categories=Utility;
StartupNotify=true
EOF
desktop-file-validate "$PKG/usr/share/applications/cin-main-lobby.desktop"

cat > "$PKG/DEBIAN/control" <<'EOF'
Package: core-identification-nodes
Version: 0.4.0
Section: utils
Priority: optional
Architecture: arm64
Depends: libc6 (>= 2.35), libstdc++6
Maintainer: LAEV <lerryalexelizondo@users.noreply.github.com>
Description: Core Identification Nodes Main Lobby
 Native relocatable CIN application payload for Linux ARM64.
EOF

cat > "$PKG/DEBIAN/postinst" <<'EOF'
#!/bin/sh
set -e
chmod 0755 /usr/bin/cin-main-lobby /opt/cin/AppDir/AppRun
exit 0
EOF
cat > "$PKG/DEBIAN/prerm" <<'EOF'
#!/bin/sh
set -e
exit 0
EOF
chmod 0755 "$PKG/DEBIAN/postinst" "$PKG/DEBIAN/prerm"

dpkg-deb --root-owner-group --build "$PKG" "$ROOT/dist/Core_Identification_Nodes-arm64.deb"
test "$(dpkg-deb -f "$ROOT/dist/Core_Identification_Nodes-arm64.deb" Architecture)" = "arm64"
dpkg-deb --info "$ROOT/dist/Core_Identification_Nodes-arm64.deb"
dpkg-deb --contents "$ROOT/dist/Core_Identification_Nodes-arm64.deb"
sha256sum "$ROOT/dist/Core_Identification_Nodes-arm64.deb"
