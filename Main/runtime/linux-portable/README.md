# CIN Linux Portable Local Web Runtime

This prototype launches a local HTTP service and serves its interface in the user's normal browser. It is not the CIN Genesis Lobby and does not issue production CIN records or credentials.

## User experience
- Extract the ZIP and run ./run-cin.sh as the current desktop user.
- CIN binds only to 127.0.0.1.
- Port selection order: 1221, then 2112, then an operating-system-assigned ephemeral port.
- The selected address is printed as CIN_URL=... and opened using xdg-open when available.
- No root privileges, system-wide installation or external network connection are required.

## Data location
- CIN_DATA_ROOT, when set to a non-empty path.
- Otherwise $XDG_DATA_HOME/cin.
- Otherwise $HOME/.local/share/cin.

Application data remains outside the extracted application directory so the portable folder can be moved without moving the data store.

## Build and package
From this directory:
cargo test
cargo build --release

From the repository root:
bash scripts/package-linux-zip.sh Main/runtime/linux-portable/target/release/cin-linux-prototype

Extract dist/CIN-Linux-Portable-x86_64.zip and run ./run-cin.sh.

## HTTP routes
- GET / — local web interface.
- GET /health — process health check.
- GET /api/status — runtime and data-root status.
- GET /api/lifecycle — process lifecycle state, selected browser and uptime.
- POST /api/runtime/shutdown — requests graceful runtime shutdown.
- POST /api/probe/write — writes and verifies the persistence probe.
- GET /api/probe/read — reads the persisted probe.

## Scope and limitations
- Linux x86_64 prototype.
- Standard-library HTTP server; no third-party runtime dependency.
- Browser launch prefers Chromium (`CIN_BROWSER` can select an executable), then falls back to `xdg-open`; the printed URL can be opened manually if neither is available.
- The Runtime Lifecycle Manager exposes `STARTING`, `READY`, `STOPPING` and `STOPPED` process states. `GET /api/lifecycle` returns the current state; `POST /api/runtime/shutdown` requests graceful shutdown.
- Linux CI installs Chromium and runs a headless browser acceptance test against the actual local runtime. `CIN_BROWSER_HEADLESS=1` is reserved for this smoke-test mode and uses Chromium's headless DOM-dump launch flags.
- The prototype package is unsigned and is not a production release.
- The persistence probe is not the production CIN record store.
- No USB signer, certificate engine, Genesis, node birth, personal registration or Main Lobby.
