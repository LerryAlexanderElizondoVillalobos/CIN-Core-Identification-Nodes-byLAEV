#!/bin/sh
set -eu
HERE="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
if [ "$(uname -m)" != "aarch64" ] && [ "$(uname -m)" != "arm64" ]; then
  echo "CIN portable package requires Linux ARM64/AArch64; detected: $(uname -m)" >&2
  exit 2
fi
export APPIMAGE_EXTRACT_AND_RUN=1
exec "$HERE/AppDir/AppRun" --run "$@"
