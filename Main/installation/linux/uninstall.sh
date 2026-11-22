#!/usr/bin/env bash
set -euo pipefail
PREFIX="$HOME/.local/share/cin"
REMOVE_DATA=0
while (($#)); do
  case "$1" in
    --prefix) [[ $# -ge 2 ]] || { echo "Missing path for --prefix" >&2; exit 2; }; PREFIX="$2"; shift 2 ;;
    --remove-data) REMOVE_DATA=1; shift ;;
    --help|-h) echo "Usage: bash uninstall.sh [--prefix PATH] [--remove-data]"; exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 2 ;;
  esac
done
if command -v systemctl >/dev/null; then
  systemctl --user disable --now cin-main.service >/dev/null 2>&1 || true
fi
rm -f "$HOME/.config/systemd/user/cin-main.service" "$HOME/.local/bin/cin-main" "$HOME/.local/bin/cin-main-cli"
rm -f "$PREFIX/bin/cin-linux-main" "$PREFIX/bin/cin-certificate-runner" "$PREFIX/bin/cin-genesis-manifest"
if command -v systemctl >/dev/null; then systemctl --user daemon-reload >/dev/null 2>&1 || true; fi
rm -rf "$PREFIX/Main"
if [[ "$REMOVE_DATA" -eq 1 ]]; then
  rm -rf "$HOME/.config/cin"
fi
echo "CIN Main files removed from $PREFIX. Configuration/data removal: $REMOVE_DATA"
