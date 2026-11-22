#!/usr/bin/env bash
set -euo pipefail

PREFIX="$HOME/.local/share/cin"
INSTALL_SERVICE=1
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/../../../.." && pwd)"
MAIN_SOURCE="$REPO_ROOT/Main"

usage() {
  cat <<'USAGE'
CIN Main Linux user-space installer
Usage: bash install.sh [--prefix PATH] [--no-service] [--help]
  --prefix PATH   Installation location (default: $HOME/.local/share/cin)
  --no-service    Skip systemd user service installation
  --help          Show this help
USAGE
}
while (($#)); do
  case "$1" in
    --prefix) [[ $# -ge 2 ]] || { echo "Missing path for --prefix" >&2; exit 2; }; PREFIX="$2"; shift 2 ;;
    --no-service) INSTALL_SERVICE=0; shift ;;
    --help|-h) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage; exit 2 ;;
  esac
done

[[ -d "$MAIN_SOURCE" ]] || { echo "Cannot find Main source at $MAIN_SOURCE" >&2; exit 1; }
mkdir -p "$PREFIX/Main" "$HOME/.config/cin" "$HOME/.local/bin"
cp -R "$MAIN_SOURCE/." "$PREFIX/Main/"
if [[ ! -f "$HOME/.config/cin/config.json" ]]; then
  cp "$PREFIX/Main/core/configuration/config.example.json" "$HOME/.config/cin/config.json"
fi
cat > "$HOME/.local/bin/cin-main" <<EOF
#!/usr/bin/env bash
exec python3 "$PREFIX/Main/core/runtime/cin_main.py" "\$@"
EOF
chmod 755 "$HOME/.local/bin/cin-main"

if [[ "$INSTALL_SERVICE" -eq 1 ]] && command -v systemctl >/dev/null && systemctl --user >/dev/null 2>&1; then
  mkdir -p "$HOME/.config/systemd/user"
  cat > "$HOME/.config/systemd/user/cin-main.service" <<EOF
[Unit]
Description=CIN Main local runtime
After=default.target

[Service]
Type=simple
ExecStart=$HOME/.local/bin/cin-main serve
Restart=on-failure
RestartSec=3

[Install]
WantedBy=default.target
EOF
  systemctl --user daemon-reload
  systemctl --user enable cin-main.service
  echo "Installed systemd user service. Start it with: systemctl --user start cin-main.service"
fi

echo "CIN Main installed at: $PREFIX"
echo "CLI: $HOME/.local/bin/cin-main"
echo "Config: $HOME/.config/cin/config.json"
