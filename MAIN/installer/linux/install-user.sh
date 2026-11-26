#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID:-$(id -u)}" -eq 0 ]]; then
  echo "Run this installer as your normal desktop user, not as root." >&2
  exit 1
fi
PACKAGE="${1:-}"
if [[ -z "$PACKAGE" || ! -f "$PACKAGE" ]]; then
  echo "Usage: bash install-user.sh /path/to/CIN.deb" >&2
  exit 2
fi
for command_name in dpkg-deb python3 openssl; do
  command -v "$command_name" >/dev/null || { echo "Missing required command: $command_name" >&2; exit 1; }
done
python3 - <<'PY'
try:
    import gi
    gi.require_version("Gtk", "4.0")
    from gi.repository import Gtk
except Exception as exc:
    raise SystemExit("CIN requires Python 3, PyGObject and GTK 4 already available to this user. " + str(exc))
PY
PACKAGE="$(cd "$(dirname "$PACKAGE")" && pwd)/$(basename "$PACKAGE")"
PYTHON_BIN="$(command -v python3)"
APP_DIR="$HOME/.local/opt/cin-main-lobby"
BIN_DIR="$HOME/.local/bin"
APPS_DIR="$HOME/.local/share/applications"
PARENT_DIR="$(dirname "$APP_DIR")"
TEMP_DIR="$(mktemp -d "$PARENT_DIR/.cin-install.XXXXXX")"
BACKUP_DIR="$PARENT_DIR/.cin-previous"
cleanup() { rm -rf "$TEMP_DIR"; }
trap cleanup EXIT
mkdir -p "$PARENT_DIR"
dpkg-deb --extract "$PACKAGE" "$TEMP_DIR"
test -f "$TEMP_DIR/opt/cin-main-lobby/cin_main.py" || { echo "Unexpected CIN.deb payload." >&2; exit 1; }
test -d "$TEMP_DIR/opt/cin-main-lobby/settings/deployment" || { echo "Deployment engine missing from CIN.deb." >&2; exit 1; }
install -d "$BIN_DIR" "$APPS_DIR" "$HOME/.local/share/cin-main-lobby" "$HOME/.config/cin-main-lobby"
# Bootstrap migration: replace the previous application payload while retaining operator data/configuration.
rm -rf "$BACKUP_DIR"
if [[ -d "$APP_DIR" ]]; then mv "$APP_DIR" "$BACKUP_DIR"; fi
if ! mv "$TEMP_DIR/opt/cin-main-lobby" "$APP_DIR"; then
  [[ ! -d "$BACKUP_DIR" ]] || mv "$BACKUP_DIR" "$APP_DIR"
  echo "CIN application replacement failed; previous installation restored." >&2
  exit 1
fi
rm -rf "$BACKUP_DIR"
cat > "$BIN_DIR/cin-main" <<EOF
#!/bin/sh
exec "$PYTHON_BIN" "$APP_DIR/cin_main.py" "\$@"
EOF
chmod 0755 "$BIN_DIR/cin-main"
cat > "$APPS_DIR/cin-main.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=CIN Main Lobby
Comment=Core Identification Nodes byLAEV
Exec=$BIN_DIR/cin-main
Icon=applications-system
Terminal=false
Categories=Utility;
StartupNotify=true
EOF
chmod 0644 "$APPS_DIR/cin-main.desktop"
echo "CIN Main installed for $(id -un) under $HOME/.local."
echo "Bootstrap migration completed. User data and publisher configuration were preserved."
echo "Deployment engine is installed; official updates require the independently provisioned Ed25519 publisher key."
