#!/bin/sh
set -eu

fail() { printf 'CIN installer: %s\n' "$*" >&2; exit 1; }
[ "$(id -u)" -ne 0 ] || fail "Do not run as root or with sudo. Run as your normal desktop user."
[ -n "${HOME:-}" ] || fail "HOME is not set."

ARCH="$(dpkg --print-architecture 2>/dev/null || true)"
[ "$ARCH" = "arm64" ] || fail "This package targets Debian ARM64; detected dpkg architecture: ${ARCH:-unknown}."

if [ -r /etc/os-release ]; then
  . /etc/os-release
  [ "${ID:-}" = "debian" ] && [ "${VERSION_ID:-}" = "13" ] || fail "This release targets Debian 13 (Trixie). Detected: ${PRETTY_NAME:-unknown}."
else
  fail "Cannot identify the operating system through /etc/os-release."
fi

command -v dpkg-deb >/dev/null 2>&1 || fail "dpkg-deb is required (Debian package dpkg)."
HERE="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
DEB="${CIN_DEB_PATH:-$HERE/CIN.deb}"
[ -f "$DEB" ] || fail "CIN.deb was not found beside this installer."

PKG_ARCH="$(dpkg-deb -f "$DEB" Architecture)"
[ "$PKG_ARCH" = "arm64" ] || fail "Unexpected package architecture: $PKG_ARCH."
PKG_NAME="$(dpkg-deb -f "$DEB" Package)"
[ "$PKG_NAME" = "core-identification-nodes" ] || fail "Unexpected Debian package: $PKG_NAME."

DATA_HOME="${XDG_DATA_HOME:-$HOME/.local/share}"
APP_HOME="$HOME/.local/opt/cin-main-lobby"
BIN_HOME="$HOME/.local/bin"
DESKTOP_HOME="$DATA_HOME/applications"
ICON_HOME="$DATA_HOME/icons/hicolor/256x256/apps"
STAGE="$HOME/.local/opt/.cin-stage-$$"
BACKUP="$HOME/.local/opt/.cin-backup-$$"
mkdir -p "$HOME/.local/opt" "$BIN_HOME" "$DESKTOP_HOME" "$ICON_HOME"
trap 'rm -rf "$STAGE" "$BACKUP"' EXIT HUP INT TERM
mkdir -p "$STAGE"
dpkg-deb -x "$DEB" "$STAGE"
[ -x "$STAGE/opt/cin/AppDir/AppRun" ] || fail "Package payload is incomplete: AppRun is missing."
[ -x "$STAGE/opt/cin/AppDir/usr/bin/cin-main" ] || fail "Package payload is incomplete: CIN Main Lobby executable is missing."

if [ -d "$APP_HOME" ]; then
  mv "$APP_HOME" "$BACKUP"
fi
if ! mkdir -p "$APP_HOME" || ! cp -a "$STAGE/opt/cin/AppDir" "$APP_HOME/AppDir"; then
  rm -rf "$APP_HOME"
  [ ! -d "$BACKUP" ] || mv "$BACKUP" "$APP_HOME"
  fail "Could not install CIN into the current user's home directory."
fi
rm -rf "$BACKUP"

cat > "$BIN_HOME/cin" <<EOF
#!/bin/sh
set -eu
APP="$APP_HOME/AppDir"
export APPIMAGE_EXTRACT_AND_RUN=1
exec "$APP/AppRun" --run "\$@"
EOF
chmod 0755 "$BIN_HOME/cin"

UNINSTALL_SOURCE="$HERE/uninstall-user.sh"
if [ -f "$UNINSTALL_SOURCE" ]; then
  cp "$UNINSTALL_SOURCE" "$BIN_HOME/cin-uninstall"
else
  cat > "$BIN_HOME/cin-uninstall" <<EOF
#!/bin/sh
set -eu
rm -f "$BIN_HOME/cin" "$BIN_HOME/cin-uninstall"
rm -f "$DESKTOP_HOME/cin.desktop" "$ICON_HOME/cin.png"
rm -rf "$APP_HOME"
echo "CIN removed. User data and configuration were preserved."
EOF
fi
chmod 0755 "$BIN_HOME/cin-uninstall"

ICON_SOURCE="$APP_HOME/AppDir/usr/share/icons/hicolor/256x256/apps/cin-main-lobby.png"
if [ -f "$ICON_SOURCE" ]; then
  cp "$ICON_SOURCE" "$ICON_HOME/cin.png"
else
  ICON_SOURCE="$APP_HOME/AppDir/usr/share/icons/hicolor/scalable/apps/cin-main-lobby.svg"
  if [ -f "$ICON_SOURCE" ]; then
    mkdir -p "$DATA_HOME/icons/hicolor/scalable/apps"
    cp "$ICON_SOURCE" "$DATA_HOME/icons/hicolor/scalable/apps/cin.svg"
  fi
fi

cat > "$DESKTOP_HOME/cin.desktop" <<EOF
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
chmod 0644 "$DESKTOP_HOME/cin.desktop"

printf 'CIN installed for user %s.\n' "$(id -un)"
printf 'Launch: %s/cin\n' "$BIN_HOME"
printf 'Uninstall: %s/cin-uninstall\n' "$BIN_HOME"
