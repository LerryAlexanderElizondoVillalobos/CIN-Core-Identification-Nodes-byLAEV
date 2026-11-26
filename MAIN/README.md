# CIN Main — Two-Phase Installation Strategy

CIN Main is built in **two sequential phases**. The first phase delivers the installer for the Main Lobby. The second phase delivers the installer for the CIN Package Engine — the engine of engines.

## Phase 1 — Main Lobby Installer

Build a Debian package (.deb) targeting **arm64 / AArch64** whose sole product is the **CIN Main Lobby** and its required runtime and foundational components. The package targets Debian-compatible ARM64 Linux userspaces, including Android-hosted environments such as LinDesk, and conventional ARM64 Linux. Virtualization is optional; the same package must be qualified in both virtualized and non-virtualized profiles.

After installation, the Lobby provides the three founding certificate processes:

1. **Genesis Environment Certificate** → Genesis Environment Manifest, registered as the first logical CIN record.
2. **CIN Node Birth Certificate** → applicable technical node identifiers and the authoritative Node Birth Record.
3. **CIN Global Personal Document and Node Marriage Certificate** → CIN Global Personal Document identifier and the separately persisted, cryptographically accepted node-document association.

The Lobby coordinates these processes, stores their records locally and reconstructs their real status. The three processes are part of the Lobby delivered in Phase 1; they are not three additional installation phases.

The later CIN Personal Registration and Credential process remains a subsequent issuance stage, not one of the three founding processes.

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

**Two-phase architecture defined; implementation not yet started.** Phase 1 is the immediate development target. No installer or certificate engine is claimed to be functional yet.
