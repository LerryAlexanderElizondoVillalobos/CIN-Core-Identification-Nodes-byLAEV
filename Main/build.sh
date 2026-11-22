#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
echo "[CIN Main] Testing and building Linux runtime"
(cd "$ROOT/runtime/linux-portable" && cargo test && cargo build --release)
echo "[CIN Main] Testing and building domain core"
(cd "$ROOT/core/domain" && cargo test && cargo build --release)
echo "[CIN Main] Testing local service"
(cd "$ROOT/services/cin-local-backend" && npm test)
echo "Main build completed. Binaries:"
echo " - $ROOT/runtime/linux-portable/target/release/cin-linux-main"
echo " - $ROOT/core/domain/target/release/cin-certificate-runner"
echo " - $ROOT/core/domain/target/release/cin-genesis-manifest"
