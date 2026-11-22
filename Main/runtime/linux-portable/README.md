# CIN Main — Linux Portable Runtime

The Linux portable runtime is the primary local runtime entrypoint under the new Main architecture. It runs the local CIN web interface, exposes local lifecycle/status routes, and keeps persistence outside the extracted runtime package.

## Build and tests
```sh
cargo test
cargo build --release
```

## Launch
```sh
./target/release/cin-linux-main
```

The runtime selects ports 1221, 2112, then an ephemeral loopback port. It binds only to `127.0.0.1`, prints `CIN_URL`, and attempts to open a browser. Data root precedence: `CIN_DATA_ROOT`, `XDG_DATA_HOME/cin`, `HOME/.local/share/cin`.

## Routes
- GET `/` and `/index.html`: local UI
- GET `/health`: process health
- GET `/api/status`: runtime/data root
- GET `/api/lifecycle`: state/port/uptime/browser
- POST `/api/runtime/shutdown`: graceful shutdown request
- POST `/api/probe/write` and GET `/api/probe/read`: non-production persistence probe

The probe is only a runtime smoke capability; it is not a production document store. No production certificate issuance, record registration or private signing keys are included.

The original prototype source remains temporarily at `prototype/linux-runtime` until migration acceptance and old CI references are replaced.
