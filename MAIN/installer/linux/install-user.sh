#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID:-$(id -u)}" -eq 0 ]]; then
  echo "Run this installer as your normal desktop user, not as root." >&2
  exit 1
fi

PACKAGE="${1:-}"
if [[ -z "$PACKAGE" || ! -f "$PACKAGE" ]]; then
  echo "Usage: bash install-user.sh /path/to/Core_Identification_Nodes.deb" >&2
  exit 2
fi

for command_name in dpkg-deb python3 openssl systemctl systemd-run; do
  command -v "$command_name" >/dev/null || {
    echo "Missing required command: $command_name" >&2
    exit 1
  }
done

# CIN's network switch is enforced on its dedicated systemd user scope.
# Refuse a misleading partial installation when the user manager is unavailable.
if ! systemctl --user show-environment >/dev/null 2>&1; then
  echo "CIN requires an active systemd user manager for its application-scoped network switch." >&2
  exit 1
fi

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
mkdir -p "$PARENT_DIR"
TEMP_DIR="$(mktemp -d "$PARENT_DIR/.cin-install.XXXXXX")"
BACKUP_DIR="$PARENT_DIR/.cin-previous"
cleanup() { rm -rf "$TEMP_DIR"; }
trap cleanup EXIT

dpkg-deb --extract "$PACKAGE" "$TEMP_DIR"
PAYLOAD="$TEMP_DIR/opt/cin-main-lobby"
INSTALLER_PAYLOAD="$TEMP_DIR/opt/cin-installer"
test -x "$INSTALLER_PAYLOAD/uninstall-user.sh" || { echo "CIN uninstaller is missing from package." >&2; exit 1; }
test -f "$PAYLOAD/cin_main.py" || { echo "Unexpected CIN Debian payload." >&2; exit 1; }
test -f "$PAYLOAD/settings/deployment/engine.py" || { echo "CIN Deploy engine is missing from package." >&2; exit 1; }
test -f "$PAYLOAD/settings/network_access.py" || { echo "CIN network controller is missing from package." >&2; exit 1; }

install -d "$BIN_DIR" "$APPS_DIR" "$HOME/.local/share/cin-main-lobby" "$HOME/.config/cin-main-lobby"

# Replace only the application payload; preserve operator data and publisher trust.
rm -rf "$BACKUP_DIR"
if [[ -d "$APP_DIR" ]]; then mv "$APP_DIR" "$BACKUP_DIR"; fi
if ! mv "$PAYLOAD" "$APP_DIR"; then
  [[ ! -d "$BACKUP_DIR" ]] || mv "$BACKUP_DIR" "$APP_DIR"
  echo "CIN application replacement failed; previous installation restored." >&2
  exit 1
fi
rm -rf "$BACKUP_DIR"
install -m 0755 "$INSTALLER_PAYLOAD/uninstall-user.sh" "$APP_DIR/uninstall-user.sh"

cat > "$BIN_DIR/cin-main" <<EOF
#!/bin/sh
# Run CIN in its dedicated systemd user scope. IPAddressDeny is applied only
# to this scope, leaving the host and all other applications unaffected.
exec systemd-run --user --scope --unit=cin-main-lobby -- "$PYTHON_BIN" "$APP_DIR/cin_main.py" "$@"
EOF
chmod 0755 "$BIN_DIR/cin-main"

cat > "$APPS_DIR/cin-main.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=Core Identification Nodes
Comment=CIN Main Lobby — Deploy and application-scoped network control
Exec=$BIN_DIR/cin-main
Icon=applications-system
Terminal=false
Categories=Utility;
StartupNotify=true
EOF
chmod 0644 "$APPS_DIR/cin-main.desktop"

echo "Core Identification Nodes installed for $(id -un) under $HOME/.local."
echo "Deploy engine and CIN-scoped network switch are included."
echo "Official code deployment remains unavailable until the publisher key and signed official manifest are independently provisioned."
