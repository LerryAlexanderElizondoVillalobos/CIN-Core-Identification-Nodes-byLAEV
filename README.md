# CIN — Core Identification Nodes byLAEV

The first delivery target is **First Successful CIN Main Lobby**: a portable local node that verifies its package, persists its lifecycle records, completes authorized birth and personal registration, assembles its Main Lobby from verified records, and recovers after close/reopen.

## Development control
- [Latest Repository Audit Report (2026-11-15)](docs/project/CIN_AUDIT_REPORT_2026-11-15.md)
- [Master Implementation Workplan](docs/project/CIN_MASTER_IMPLEMENTATION_WORKPLAN.md)
- [Implementation Directory Map](docs/architecture/CIN_IMPLEMENTATION_DIRECTORY_MAP.md)
- [Workflow Catalog](docs/project/CIN_WORKFLOW_CATALOG.md)
- [Implementation Test Strategy](docs/testing/CIN_IMPLEMENTATION_TEST_STRATEGY.md)
- [Development Backlog](docs/project/DEVELOPMENT_BACKLOG.md)
- [Project Status and Roadmap](docs/project/PROJECT_STATUS_AND_ROADMAP.md)

## Genesis Environment Manifest
- [Genesis Manifest v1 specification](specifications/CIN_GENESIS_ENVIRONMENT_MANIFEST_V1.md)
- [Genesis Manifest JSON Schema](schemas/cin-genesis-environment-manifest-v1.schema.json)
- [Illustrative Genesis Manifest fixture](examples/cin-genesis-environment-manifest-v1.example.json)

The initial Rust implementation audits a purpose-limited set of OS/runtime/hardware/network/package fields, preserves field provenance and unavailable states, and can register the manifest as the first logical document. It does not yet provide production signatures, archive-origin verification, complete cross-platform hardware discovery or a GUI review step.

Run the initial manifest generator from the extracted package context with `cargo run --manifest-path prototype/cin-core/Cargo.toml --bin cin-genesis-manifest -- --package-root ./path/to/extracted-cin` (or omit the argument when the executable is already inside the extracted package directory). It prints the candidate and waits for explicit confirmation before committing it to the resolved CIN data root.

## Current maturity
The repository contains architecture/specifications, schema validation, a Linux portable runtime feasibility prototype, and an initial Rust domain foundation with lifecycle unit tests. The complete CIN engines and Main Lobby are not yet implemented. Passing documentation or foundation CI does not mean the complete product is accepted.

## Build/test the initial domain foundation
    cargo fmt --manifest-path prototype/cin-core/Cargo.toml --all -- --check
    cargo clippy --manifest-path prototype/cin-core/Cargo.toml --all-targets -- -D warnings
    cargo test --manifest-path prototype/cin-core/Cargo.toml --all-targets

See the master workplan for the dependency order and completion gates.
