# Main migration status

## Target
Linux-first installation and runtime. Lindesk Android is the intended installation/control entry point; its concrete transport is not yet verified.

## Migrated into Main
- Portable Linux Rust runtime (server, browser launch integration, lifecycle manager).
- Local web UI.
- Rust domain-core crate, including document model, schema validation, lifecycle, Genesis audit/manifest, transactional storage, recovery, and CLI binaries.
- Linux installer builds/installs runtime and domain tools when Cargo is present.
- Portable package builder and CI/E2E paths now target Main.
- Main-specific migration plan and smoke tests.

## Transitional copies still present
- `prototype/linux-runtime` and `prototype/dist`: original runtime source.
- `prototype/cin-core`: original domain source.
- `termux-cin`: Android/Termux local backend.
- `services/cin-local-backend`: local pairing/state backend.
- `Core Identification Node Github/`: published GitHub Pages Lobby source.
- `docs/`, `specifications/`, `schemas/`, `examples/`, `research/`: canonical documentation/contracts until ownership moves are completed.

## Next work
1. Move Android/Termux and local backend services into Main's integration/service boundaries with compatibility references.
2. Audit certificate/application assets and Pages workflows; preserve publication paths while migrating source ownership.
3. Map all remaining root paths and individual files in the migration register.
4. Add acceptance tests and run Linux CI for the migrated Main tree.
5. Remove duplicated legacy code only after Main CI passes and all references are updated.
