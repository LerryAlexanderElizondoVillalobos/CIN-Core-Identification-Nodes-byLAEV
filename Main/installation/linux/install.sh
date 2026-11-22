#!/usr/bin/env bash
set -euo pipefail

PREFIX="$HOME/.local/share/cin"
BUILD_RUNTIME=1
INSTALL_SERVICE=1
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/../../.." && pwd)"
MAIN_SOURCE="$REPO_ROOT/Main"

usage() {
  cat <<'USAGE'
CIN Main Linux user-space installer
Usage: bash install.sh [--prefix PATH] [--no-build] [--no-service] [--help]
  --prefix PATH   Installation directory (default: $HOME/.local/share/cin)
  --no-build     Skip Rust build; install Python control CLI only
  --no-service   Skip systemd user service setup
  --help          Show this help
USAGE
}
while (($#)); do
  case "$1" in
    --prefix) [[ $# -ge 2 ]] || { echo "Missing path for --prefix" >&2; exit 2; }; PREFIX="$2"; shift 2 ;;
    --no-build) BUILD_RUNTIME=0; shift ;;
    --no-service) INSTALL_SERVICE=0; shift ;;
    --help|-h) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage; exit 2 ;;
  esac
done

[[ -d "$MAIN_SOURCE" ]] || { echo "Cannot find Main source at $MAIN_SOURCE" >&2; exit 1; }
mkdir -p "$PREFIX/Main" "$PREFIX/bin" "$HOME/.config/cin" "$HOME/.local/bin"
cp -R "$MAIN_SOURCE/." "$PREFIX/Main/"
if [[ ! -f "$HOME/.config/cin/config.json" ]]; then
  cp "$PREFIX/Main/core/configuration/config.example.json" "$HOME/.config/cin/config.json"
fi

if [[ "$BUILD_RUNTIME" -eq 1 ]] && command -v cargo >/dev/null 2>&1; then
  echo "Building CIN Linux runtime..."
  (cd "$PREFIX/Main/runtime/linux-portable" && cargo build --release)
  install -m 0755 "$PREFIX/Main/runtime/linux-portable/target/release/cin-linux-main" "$PREFIX/bin/cin-linux-main"
  echo "Building CIN domain tools..."
  (cd "$PREFIX/Main/core/domain" && cargo build --release)
  echo "Building CIN binary Merkle engine..."
  (cd "$PREFIX/Main/engines/merkle-tree" && cargo build --release)
  for tool in cin-certificate-runner cin-genesis-manifest; do
    if [[ -x "$PREFIX/Main/core/domain/target/release/$tool" ]]; then
      install -m 0755 "$PREFIX/Main/core/domain/target/release/$tool" "$PREFIX/bin/$tool"
    fi
  done
else
  echo "Rust/Cargo not available or --no-build selected; Linux web runtime is not installed." >&2
fi

cat > "$HOME/.local/bin/cin-main" <<EOF
#!/usr/bin/env bash
set -euo pipefail
if [[ -x "$PREFIX/bin/cin-linux-main" ]]; then
  exec "$PREFIX/bin/cin-linux-main" "\$@"
fi
echo "CIN Linux runtime binary is not installed. Re-run the installer with Rust/Cargo available." >&2
exit 1
EOF
chmod 755 "$HOME/.local/bin/cin-main"

cat > "$HOME/.local/bin/cin-main-cli" <<EOF
#!/usr/bin/env bash
exec python3 "$PREFIX/Main/core/runtime/cin_main.py" "\$@"
EOF
chmod 755 "$HOME/.local/bin/cin-main-cli"

cat > "$HOME/.local/bin/cin-module" <<EOF
#!/usr/bin/env bash
exec python3 "$PREFIX/Main/core/module-manager/cin_module.py" "\\$@"
EOF
chmod 755 "$HOME/.local/bin/cin-module"

if [[ "$INSTALL_SERVICE" -eq 1 ]] && command -v systemctl >/dev/null && systemctl --user >/dev/null 2>&1; then
  mkdir -p "$HOME/.config/systemd/user"
  cat > "$HOME/.config/systemd/user/cin-main.service" <<EOF
[Unit]
Description=CIN Main Linux local runtime
After=default.target

[Service]
Type=simple
ExecStart=$HOME/.local/bin/cin-main
Restart=on-failure
RestartSec=3

[Install]
WantedBy=default.target
EOF
  systemctl --user daemon-reload
  systemctl --user enable cin-main.service
  echo "systemd user service installed. Start with: systemctl --user start cin-main.service"
fi

echo "CIN Main installed at: $PREFIX"
echo "Runtime launcher: $HOME/.local/bin/cin-main"
echo "Control CLI: $HOME/.local/bin/cin-main-cli"
echo "Configuration: $HOME/.config/cin/config.json"
