# CIN Linux Portable Runtime Prototype

This is a feasibility prototype for the delivery contract: verify ZIP → extract directory → launch locally. It is not a conventional installer and is not the CIN Genesis or Main Lobby implementation.

## User-level execution model
- The extracted application is launched by the current desktop user; no `sudo`, root account or system-wide installation is used.
- The application writes its data under `CIN_DATA_ROOT`, otherwise `$XDG_DATA_HOME/cin-prototype`, otherwise `$HOME/.local/share/cin-prototype`.
- The user must have normal write permission to their own data directory and execute permission on the extracted folder.
- The build runner installs development packages as part of CI image preparation. This is not an instruction for the CIN end user.
- A target Linux desktop must already provide compatible GTK 3 and WebKitGTK 4.1 runtime libraries. CIN does not attempt privileged package installation.

## Current scope
- Tauri v2 desktop shell with bundled local HTML.
- Local runtime status and persistence probe.
- Staged write, read-back comparison and rename commit.
- Headless probe commands used to verify persistence across separate process invocations.
- No network service, production credentials, personal data or production signing keys.

## Linux prerequisites
Ubuntu/Debian build prerequisites for developers/CI:
`build-essential curl wget file libxdo-dev libssl-dev librsvg2-dev libwebkit2gtk-4.1-dev zip`.

The ZIP does not bundle host GTK/WebKitGTK libraries and is not yet self-contained across Linux distributions.

## Build and package
From this directory run `cargo test` and `cargo build --release`.
From the repository root run:
`bash scripts/package-linux-zip.sh prototype/linux-runtime/target/release/cin-linux-prototype`

Extract `dist/CIN-Linux-Portable-x86_64.zip` and launch with `./run-cin.sh`.

## Persistence proof
1. Launch the extracted folder as the current user.
2. Select Write persistence probe.
3. Close the application completely.
4. Launch it again from the extracted folder.
5. Select Read persisted probe.

CI also invokes the executable twice as separate OS processes with a temporary user-owned data directory.

## Limitations
- Linux x86_64 feasibility target only.
- Host WebKitGTK/GTK runtime libraries required; no privileged installation is performed by CIN.
- ZIP publisher signature verification is not implemented; this prototype package is unsigned.
- Persistence probe is not the production CIN record store.
- No USB signer, certificates, Genesis, node birth, personal registration or Main Lobby.
- This prototype does not approve Tauri as the final framework.
