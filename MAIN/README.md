# CIN Main — New Architecture

CIN Main is being rebuilt around three successive layers:

1. **Linux User Installer** — installs and launches CIN for the current Linux user.
2. **CIN Main Lobby** — coordinates the three founding certificate processes and persists their records.
3. **CIN Package Engine** — the engine of engines; installs and manages specialized CIN packages and engines.

## Architecture and navigation

- [Main Architecture V1](ARCHITECTURE/MAIN_ARCHITECTURE_V1.md)
- [Development Roadmap](ROADMAP.md)
- [Linux User Installer](installer/linux/README.md)
- [Main Lobby](lobby/README.md)
- [CIN Package Engine](package-engine/README.md)

## Founding Lobby processes

1. Genesis Environment Certificate → Genesis Environment Manifest.
2. CIN Node Birth Certificate → technical node identifiers and Node Birth Record.
3. CIN Global Personal Document and Node Marriage Certificate → global personal-document identifier and verified node-document association.

The later CIN Personal Registration and Credential certificate is a separate subsequent issuance phase.

## Governing rules

- The Linux installer is per-user and does not require root privileges for normal operation.
- Application files, configuration, cache and persistent node records remain separate.
- Package installation is not node birth.
- The Genesis Manifest and Node Birth Record remain distinct documents.
- The Lobby reconstructs its status from persisted records and verification results.
- Private signing keys remain outside CIN Main and its packages; signing uses external providers.
- The Package Engine is a post-foundation subsystem, not part of the bootstrap installer.
- Historical files in `HISTORY/` are references, not automatically active implementation.
- The old CI workflows remain archived. New validation is introduced against the new implementation as it is built.

## Current maturity

**Architecture defined; implementation not yet started.** The directory layout and phase boundaries are established. No installer, Lobby certificate engine or Package Engine is claimed to be functional yet.
