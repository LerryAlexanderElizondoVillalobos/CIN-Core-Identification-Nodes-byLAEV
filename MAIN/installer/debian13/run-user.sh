#!/bin/sh
set -eu
[ "$(id -u)" -ne 0 ] || { echo "Do not run CIN as root or with sudo." >&2; exit 1; }
[ -n "\${HOME:-}" ] || { echo "HOME is not set." >&2; exit 1; }
ARCH="$(dpkg --print-architecture 2>/dev/null || true)"
[ "$ARCH" = arm64 ] || { echo "CIN Debian 13 requires ARM64; detected: \${ARCH:-unknown}." >&2; exit 2; }
. /etc/os-release
[ "\${ID:-}" = debian ] && [ "\${VERSION_ID:-}" = 13 ] || { echo "CIN targets Debian 13 (Trixie)." >&2; exit 2; }
command -v dpkg-deb >/dev/null 2>&1 || { echo "dpkg-deb is required." >&2; exit 1; }
HERE="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
DEB="\${CIN_DEB_PATH:-$HERE/CIN.deb}"
[ -f "$DEB" ] || { echo "CIN.deb not found beside run-user.sh." >&2; exit 1; }
CACHE_HOME="\${XDG_CACHE_HOME:-$HOME/.cache}"
mkdir -p "$CACHE_HOME"
TMP="$(mktemp -d "$CACHE_HOME/cin-run.XXXXXX")"
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT
trap 'exit 130' HUP INT TERM
dpkg-deb -x "$DEB" "$TMP"
[ -x "$TMP/opt/cin/AppDir/AppRun" ] || { echo "CIN package payload is incomplete." >&2; exit 1; }
"$TMP/opt/cin/AppDir/AppRun" --run "$@"
