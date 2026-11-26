#!/bin/sh
set -eu
fail() { printf 'CIN installer: %s\n' "$*" >&2; exit 1; }
[ "$(id -u)" -ne 0 ] || fail "Do not run as root or with sudo. Run as your normal desktop user."
[ -n "\${HOME:-}" ] || fail "HOME is not set."
ARCH="$(dpkg --print-architecture 2>/dev/null || true)"
[ "$ARCH" = arm64 ] || fail "This package targets Debian ARM64; detected dpkg architecture: \${ARCH:-unknown}."
if [ -r /etc/os-release ]; then
  . /etc/os-release
  [ "\${ID:-}" = debian ] && [ "\${VERSION_ID:-}" = 13 ] || fail "This release targets Debian 13 (Trixie). Detected: \${PRETTY_NAME:-unknown}."
else
  fail "Cannot identify the operating system through /etc/os-release."
fi
command -v dpkg-deb >/dev/null 2>&1 || fail "dpkg-deb is required."
HERE="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
DEB="\${CIN_DEB_PATH:-$HERE/CIN.deb}"
[ -f "$DEB" ] || fail "CIN.deb was not found beside this installer."
[ "$(dpkg-deb -f "$DEB" Architecture)" = arm64 ] || fail "Unexpected package architecture."
[ "$(dpkg-deb -f "$DEB" Package)" = core-identification-nodes ] || fail "Unexpected Debian package name."
DATA_HOME="\${XDG_DATA_HOME:-$HOME/.local/share}"
APP_HOME="$HOME/.local/opt/cin-main-lobby"
BIN_HOME="$HOME/.local/bin"
DESKTOP_HOME="$DATA_HOME/applications"
ICON_HOME="$DATA_HOME/icons/hicolor/256x256/apps"
SCALABLE_ICON_HOME="$DATA_HOME/icons/hicolor/scalable/apps"
STAGE="$HOME/.local/opt/.cin-stage-$$"
BACKUP="$HOME/.local/opt/.cin-backup-$$"
LAUNCHER_TMP="$BIN_HOME/.cin-launcher-$$"
UNINSTALL_TMP="$BIN_HOME/.cin-uninstaller-$$"
DESKTOP_TMP="$DESKTOP_HOME/.cin-desktop-$$"
ICON_TMP="$ICON_HOME/.cin-icon-$$"
SVG_TMP="$SCALABLE_ICON_HOME/.cin-icon-$$"
COMMITTED=0
cleanup() {
  status=$?
  rm -rf "$STAGE" "$LAUNCHER_TMP" "$UNINSTALL_TMP" "$DESKTOP_TMP" "$ICON_TMP" "$SVG_TMP"
  if [ "$COMMITTED" -eq 0 ]; then
    rm -rf "$APP_HOME"
    if [ -d "$BACKUP" ]; then mv "$BACKUP" "$APP_HOME"; fi
  else
    rm -rf "$BACKUP"
  fi
  exit "$status"
}
trap cleanup EXIT
trap 'exit 130' HUP INT TERM
mkdir -p "$HOME/.local/opt" "$BIN_HOME" "$DESKTOP_HOME" "$ICON_HOME" "$SCALABLE_ICON_HOME"
mkdir -p "$STAGE"
dpkg-deb -x "$DEB" "$STAGE"
[ -x "$STAGE/opt/cin/AppDir/AppRun" ] || fail "Package payload is incomplete: AppRun is missing."
[ -x "$STAGE/opt/cin/AppDir/usr/bin/cin-main" ] || fail "Package payload is incomplete: CIN Main Lobby executable is missing."
if [ -d "$APP_HOME" ]; then mv "$APP_HOME" "$BACKUP"; fi
mkdir -p "$APP_HOME"
cp -a "$STAGE/opt/cin/AppDir" "$APP_HOME/AppDir"
cat > "$LAUNCHER_TMP" <<EOF
#!/bin/sh
set -eu
APP="$APP_HOME/AppDir"
exec "$APP/AppRun" --run "\$@"
EOF
chmod 0755 "$LAUNCHER_TMP"
[ -f "$HERE/uninstall-user.sh" ] || fail "uninstall-user.sh is missing from the installer bundle."
cp "$HERE/uninstall-user.sh" "$UNINSTALL_TMP"
chmod 0755 "$UNINSTALL_TMP"
ICON_SOURCE="$APP_HOME/AppDir/usr/share/icons/hicolor/256x256/apps/cin-main-lobby.png"
if [ -f "$ICON_SOURCE" ]; then
  cp "$ICON_SOURCE" "$ICON_TMP"
else
  ICON_SOURCE="$APP_HOME/AppDir/usr/share/icons/hicolor/scalable/apps/cin-main-lobby.svg"
  [ -f "$ICON_SOURCE" ] || fail "CIN application icon is missing."
  cp "$ICON_SOURCE" "$SVG_TMP"
fi
cat > "$DESKTOP_TMP" <<EOF
[Desktop Entry]
Type=Application
Name=Core Identification Nodes
Comment=CIN Main Lobby
Exec=$BIN_HOME/cin
Icon=cin
Terminal=false
Categories=Utility;
StartupNotify=true
EOF
chmod 0644 "$DESKTOP_TMP"
mv -f "$LAUNCHER_TMP" "$BIN_HOME/cin"
mv -f "$UNINSTALL_TMP" "$BIN_HOME/cin-uninstall"
if [ -f "$ICON_TMP" ]; then mv -f "$ICON_TMP" "$ICON_HOME/cin.png"; rm -f "$SCALABLE_ICON_HOME/cin.svg"; fi
if [ -f "$SVG_TMP" ]; then mv -f "$SVG_TMP" "$SCALABLE_ICON_HOME/cin.svg"; rm -f "$ICON_HOME/cin.png"; fi
mv -f "$DESKTOP_TMP" "$DESKTOP_HOME/cin.desktop"
COMMITTED=1
printf 'CIN installed for user %s.\n' "$(id -un)"
printf 'Launch: %s/cin\n' "$BIN_HOME"
printf 'Uninstall: %s/cin-uninstall\n' "$BIN_HOME"
