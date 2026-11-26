#!/usr/bin/env bash
set -euo pipefail
if [[ "${EUID:-$(id -u)}" -eq 0 ]]; then
  echo "Run this uninstaller as the same normal desktop user." >&2
  exit 1
fi
rm -rf "$HOME/.local/opt/cin-main-lobby"
rm -f "$HOME/.local/bin/cin-main"
rm -f "$HOME/.local/share/applications/cin-main.desktop"
echo "CIN application files removed from this user account. No system paths were modified."
