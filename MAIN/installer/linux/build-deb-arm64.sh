#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT"
ARCH="$(uname -m)"
if [[ "$ARCH" != "aarch64" && "$ARCH" != "arm64" ]]; then
  echo "CIN Debian package must be built on ARM64; detected: $ARCH" >&2
  exit 2
fi

APPIMAGE="$ROOT/dist/Core_Identification_Nodes-aarch64.AppImage"
[[ -s "$APPIMAGE" ]] || { echo "Missing ARM64 AppImage: $APPIMAGE" >&2; exit 1; }
command -v dpkg-deb >/dev/null || { echo "Missing dpkg-deb build dependency" >&2; exit 1; }

PKG="$ROOT/build/deb-arm64"
rm -rf "$PKG"
install -d "$PKG/DEBIAN" "$PKG/opt/cin" "$PKG/usr/share/applications" \
  "$PKG/usr/share/icons/hicolor/256x256/apps" "$ROOT/dist"

install -m 0755 "$APPIMAGE" "$PKG/opt/cin/Core_Identification_Nodes-aarch64.AppImage"
install -m 0644 MAIN/installer/linux/cin-main-lobby.svg "$PKG/usr/share/icons/hicolor/scalable/apps/cin-main-lobby.svg"
command -v rsvg-convert >/dev/null || { echo "Missing rsvg-convert" >&2; exit 1; }
rsvg-convert -w 256 -h 256 MAIN/installer/linux/cin-main-lobby.svg \
  -o "$PKG/usr/share/icons/hicolor/256x256/apps/cin-main-lobby.png"

cat > "$PKG/usr/share/applications/cin-main-lobby.desktop" <<'EOF'
[Desktop Entry]
Type=Application
Name=Core Identification Nodes
Comment=CIN Main Lobby
Exec=/opt/cin/Core_Identification_Nodes-aarch64.AppImage --run
Icon=cin-main-lobby
Terminal=false
Categories=Utility;
StartupNotify=true
EOF

cat > "$PKG/DEBIAN/control" <<'EOF'
Package: core-identification-nodes
Version: 0.4.0
Section: utils
Priority: optional
Architecture: arm64
Maintainer: LAEV
Description: Core Identification Nodes Main Lobby
 User-space runtime for the CIN Main Lobby on Linux ARM64.
EOF

cat > "$PKG/DEBIAN/postinst" <<'EOF'
#!/bin/sh
set -e
chmod 0755 /opt/cin/Core_Identification_Nodes-aarch64.AppImage
exit 0
EOF
chmod 0755 "$PKG/DEBIAN/postinst"

dpkg-deb --root-owner-group --build "$PKG" "$ROOT/dist/Core_Identification_Nodes-arm64.deb"
dpkg-deb --info "$ROOT/dist/Core_Identification_Nodes-arm64.deb"
dpkg-deb --contents "$ROOT/dist/Core_Identification_Nodes-arm64.deb"
sha256sum "$ROOT/dist/Core_Identification_Nodes-arm64.deb"
