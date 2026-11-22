# CIN Main — Linux Portable Runtime

The Rust local runtime is the primary Linux Main entrypoint. It launches a local HTTP server and serves the Main web interface. It is not the Genesis Lobby and does not issue production CIN records or credentials.

## Build and test
```sh
cargo test
cargo build --release
```

## Launch
```sh
./target/release/cin-linux-main
```

Port selection order: 1221, 2112, then ephemeral. Binding is loopback-only (127.0.0.1). The runtime prints CIN_URL and attempts to launch the user's browser. Data root precedence: CIN_DATA_ROOT, XDG_DATA_HOME/cin, HOME/.local/share/cin.

## Routes
- GET / and /index.html: local web UI.
- GET /health: process health.
- GET /api/status: runtime and data root.
- GET /api/lifecycle: state, port, uptime, browser.
- POST /api/runtime/shutdown: graceful shutdown.
- POST /api/probe/write, GET /api/probe/read: development persistence probe.

The probe is not a production record store. The runtime does not include certificate issuance, node birth, registration, external signing or private key storage. The old source remains at prototype/linux-runtime temporarily.
