# CIN Linux Portable Runtime Prototype

This is a feasibility prototype for the delivery contract: ZIP → verify → extract → run locally. It is not a conventional installer and is not the CIN Genesis or Main Lobby implementation.

## Current scope
- Tauri v2 desktop shell with bundled local HTML.
- Local runtime status and persistence probe.
- Staged write, read-back comparison and atomic rename.
- Data root: CIN_DATA_ROOT override, otherwise XDG_DATA_HOME/cin-prototype, otherwise ~/.local/share/cin-prototype.
- No network service, production credentials, personal data or production signing keys.

The data root is outside the extracted application directory by default. Portable-in-folder data mode remains undecided.

## Linux prerequisites
The x86_64 binary uses host GTK and WebKitGTK 4.1 libraries. Ubuntu/Debian build prerequisites:
sudo apt-get install build-essential curl wget file libxdo-dev libssl-dev librsvg2-dev libwebkit2gtk-4.1-dev

The target desktop must provide compatible GTK 3 and WebKitGTK 4.1 runtime libraries. The ZIP does not bundle these system libraries; it is not yet a self-contained runtime for every Linux distribution.

## Build and package
From this directory run cargo test and cargo build --release.
From the repository root run:
bash scripts/package-linux-zip.sh prototype/linux-runtime/target/release/cin-linux-prototype

Extract dist/CIN-Linux-Portable-x86_64.zip and launch with ./run-cin.sh.

## Persistence proof
1. Launch the extracted folder.
2. Select Write persistence probe.
3. Close the application completely.
4. Launch it again from the extracted folder.
5. Select Read persisted probe.

The record remains under the configured data root. Set CIN_DATA_ROOT to isolate a test.

## Limitations
- Linux x86_64 feasibility target only.
- Host WebKitGTK/GTK runtime libraries required.
- ZIP publisher signature verification is not implemented; this prototype package is unsigned.
- Persistence probe is not the production CIN record store.
- No USB signer, certificates, Genesis, node birth, personal registration or Main Lobby.
- This prototype does not approve Tauri as the final framework.
