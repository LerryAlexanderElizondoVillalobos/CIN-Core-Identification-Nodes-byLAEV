#!/bin/sh
set -eu
HERE="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
ARCH="$(uname -m)"
case "$ARCH" in aarch64|arm64) ;; *) echo "CIN requires ARM64/AArch64; detected: $ARCH" >&2; exit 2 ;; esac
[ -x "$HERE/AppDir/AppRun" ] || { echo "AppDir/AppRun is missing. Extract the complete portable archive first." >&2; exit 1; }
[ -n "${HOME:-}" ] || { echo "HOME is not set." >&2; exit 1; }
APP_HOME="${XDG_DATA_HOME:-$HOME/.local/share}/cin"
BIN_HOME="${HOME}/.local/bin"
DESKTOP_HOME="${XDG_DATA_HOME:-$HOME/.local/share}/applications"
ICON_HOME="${XDG_DATA_HOME:-$HOME/.local/share}/icons/hicolor/256x256/apps"
mkdir -p "$APP_HOME" "$BIN_HOME" "$DESKTOP_HOME" "$ICON_HOME"
STAGE="$APP_HOME/AppDir.new"
rm -rf "$STAGE"
mkdir -p "$STAGE"
cp -R "$HERE/AppDir/." "$STAGE/"
chmod 0755 "$STAGE/AppRun" "$STAGE/usr/bin/cin-main" "$STAGE/usr/bin/cin-appimage-installer"
rm -rf "$APP_HOME/AppDir.old"
if [ -d "$APP_HOME/AppDir" ]; then mv "$APP_HOME/AppDir" "$APP_HOME/AppDir.old"; fi
mv "$STAGE" "$APP_HOME/AppDir"
rm -rf "$APP_HOME/AppDir.old"
cat > "$BIN_HOME/cin" <<EOF
#!/bin/sh
set -eu
APP="$APP_HOME/AppDir"
export APPIMAGE_EXTRACT_AND_RUN=1
exec "\$APP/AppRun" --run "\$@"
EOF
chmod 0755 "$BIN_HOME/cin"
cat > "$BIN_HOME/cin-uninstall" <<EOF
#!/bin/sh
set -eu
rm -f "$BIN_HOME/cin" "$BIN_HOME/cin-uninstall"
rm -f "$DESKTOP_HOME/cin-main-lobby.desktop"
rm -f "$ICON_HOME/cin-main-lobby.png"
rm -rf "$APP_HOME/AppDir"
rmdir "$APP_HOME" 2>/dev/null || true
echo "CIN application removed. User data and configuration were preserved."
EOF
chmod 0755 "$BIN_HOME/cin-uninstall"
if [ -f "$APP_HOME/AppDir/usr/share/icons/hicolor/256x256/apps/cin-main-lobby.png" ]; then
  cp "$APP_HOME/AppDir/usr/share/icons/hicolor/256x256/apps/cin-main-lobby.png" "$ICON_HOME/cin-main-lobby.png"
fi
cat > "$DESKTOP_HOME/cin-main-lobby.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=Core Identification Nodes
Comment=CIN Main Lobby
Exec=$BIN_HOME/cin
Icon=cin-main-lobby
Terminal=false
Categories=Utility;
StartupNotify=true
EOF
chmod 0644 "$DESKTOP_HOME/cin-main-lobby.desktop"
echo "CIN installed for this user at $APP_HOME/AppDir"
echo "Launch from the application menu or run: $BIN_HOME/cin"
echo "Uninstall with: $BIN_HOME/cin-uninstall"
