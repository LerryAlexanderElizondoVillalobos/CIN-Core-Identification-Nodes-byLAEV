# CIN Main — Two-Phase Installation Strategy

CIN Main is built in **two sequential phases**. The first phase delivers the installer for the Main Lobby. The second phase delivers the installer for the CIN Package Engine — the engine of engines.

## Phase 1 — Main Lobby Application: First Milestone

The first deliverable is a Linux-installable application that opens the **CIN Main Lobby** and displays:

**Welcome to Core Identification Nodes**

The initial Lobby presents three actions:

- **Create** — the only active and implemented action in this milestone. It opens the initial node-creation flow.
- **Enter** — visible in the Lobby, reserved for a later milestone.
- **Import** — visible in the Lobby, reserved for a later milestone.

The immediate implementation scope is the application installer, launchable Lobby window, welcome screen and the Create entry point. Enter and Import must not initiate incomplete workflows.

The first milestone does not claim that the three founding certificates are already implemented. They will be added to the Create flow in subsequent work. The longer Phase 1 objective remains to integrate:

1. **Genesis Environment Certificate** → Genesis Environment Manifest.
2. **CIN Node Birth Certificate** → authoritative Node Birth Record and technical node identifiers.
3. **CIN Global Personal Document and Node Marriage Certificate** → Global Personal Document identifier and separately persisted, cryptographically accepted node-document association.

The CIN Package Engine remains Phase 2 and is not part of this application milestone.

## Phase 2 — CIN Package Engine Installer

After Phase 1 has established the node's technical identifiers and the CIN Global Personal Document association, build the installer for the **CIN Package Engine**.

This is the engine of engines: it installs, registers, configures, enables, updates, disables and removes specialized CIN engines and packages. It is a separate installer and a separate product layer from the Main Lobby installer.

Initial package families include dedicated certificate engines, Ledgers, Binary Merkle Tree, Enterprise Merkle Tree, request and permission engines, external signing connectors, configurable one-time resource/UTXO-style engines, and application-specific engines.

## Architecture and navigation

- [Main Architecture V1](ARCHITECTURE/MAIN_ARCHITECTURE_V1.md)
- [Component Map](ARCHITECTURE/MAIN_COMPONENT_MAP.md)
- [Lifecycle and Package State Model](ARCHITECTURE/MAIN_STATE_MODEL.md)
- [Engine Package Contract V1](ARCHITECTURE/ENGINE_PACKAGE_CONTRACT_V1.md)
- [Development Roadmap](ROADMAP.md)
- [Phase 1 — Main Lobby Installer](installer/linux/README.md)
- [Main Lobby and its three processes](lobby/README.md)
- [Phase 2 — CIN Package Engine Installer](package-engine/README.md)

## Governing rules

- Phase 1 installs the Main Lobby only; it does not install the Package Engine.
- Phase 2 installs the Package Engine; it does not replace or reinstall the Main Lobby.
- The Phase 1 package is installed inside the selected Debian-compatible ARM64 userspace; virtualization is optional and not required by CIN Main.
- Application files, configuration, cache and persistent node records remain separate.
- Installation is not node birth; node birth occurs through the Lobby's certificate process.
- The Genesis Manifest and Node Birth Record remain distinct documents.
- Private signing keys remain outside CIN Main and its packages; signing uses external providers.
- Historical files in `HISTORY/` are references, not automatically active implementation.
- The old CI workflows remain archived. New validation is introduced against the new implementation as it is built.

## Current maturity

**Phase 1 / Milestone 1 defined:** Linux-installable Main Lobby shell with Create as the only active action. Implementation status must be updated as executable artifacts are delivered; no certificate process is claimed functional until tested.
