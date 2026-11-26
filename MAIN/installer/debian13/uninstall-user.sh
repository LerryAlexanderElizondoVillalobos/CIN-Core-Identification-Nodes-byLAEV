#!/bin/sh
set -eu

[ "$(id -u)" -ne 0 ] || { echo "Do not run as root or with sudo." >&2; exit 1; }
[ -n "${HOME:-}" ] || { echo "HOME is not set." >&2; exit 1; }

DATA_HOME="${XDG_DATA_HOME:-$HOME/.local/share}"
APP_HOME="$HOME/.local/opt/cin-main-lobby"
BIN_HOME="$HOME/.local/bin"
DESKTOP_HOME="$DATA_HOME/applications"
ICON_HOME="$DATA_HOME/icons/hicolor/256x256/apps"

rm -rf "$APP_HOME"
rm -f "$BIN_HOME/cin" "$BIN_HOME/cin-uninstall"
rm -f "$DESKTOP_HOME/cin.desktop" "$ICON_HOME/cin.png" "$DATA_HOME/icons/hicolor/scalable/apps/cin.svg"
rmdir "$DESKTOP_HOME" 2>/dev/null || true
echo "CIN application removed for user $(id -un)."
echo "User data, configuration and cache were preserved."
