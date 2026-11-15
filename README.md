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

## Current maturity
The repository contains architecture/specifications, schema validation, a Linux portable runtime feasibility prototype, and an initial Rust domain foundation with lifecycle unit tests. The complete CIN engines and Main Lobby are not yet implemented. Passing documentation or foundation CI does not mean the complete product is accepted.

## Build/test the initial domain foundation
    cargo fmt --manifest-path prototype/cin-core/Cargo.toml --all -- --check
    cargo clippy --manifest-path prototype/cin-core/Cargo.toml --all-targets -- -D warnings
    cargo test --manifest-path prototype/cin-core/Cargo.toml --all-targets

See the master workplan for the dependency order and completion gates.
