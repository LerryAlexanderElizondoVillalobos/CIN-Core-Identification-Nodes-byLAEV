# CIN Engines

Engines are independent capabilities managed by CIN Main. They are not all activated by the installer.

## Implemented
- **Certificate assets:** migrated certificate sources are kept under `certificate/assets/`, with version-specific Genesis files preserved.
- **Binary Merkle Engine:** standalone Rust crate at `merkle-tree/`, with domain-separated SHA-256 leaf/node hashes, deterministic odd-leaf handling, roots and proofs.

## Migrated assets / interfaces
- **Certificate engine assets:** Genesis environment, Node Birth, Global Personal Document/Node Marriage, and Personal Registration certificate files are preserved under `certificate/assets/`. Their original versions remain distinct; they are not silently reconciled.
- **Permission engine interface:** Android/Termux permission-engine source is in `Main/installation/android-termux/src/authorization/`.
- **Signing interface:** external signer adapter contract is in `Main/installation/android-termux/src/signatures/`. Main does not store private signing keys.

## Planned separate engines
- Ledger and certificate record management.
- Certificate installation/management.
- Binary Merkle tree processing.
- Permission/request policy engine.
- Generalized one-time expenditure/resource engine using UTXO concepts, not inherently Bitcoin.
- External signing integration (device, USB, or plugin).

Each engine owns its descriptor, configuration, lifecycle, input/output contracts, persistence needs and tests. Engines are installed/enabled independently; the module registry currently manages declared enablement and does not start processes.
