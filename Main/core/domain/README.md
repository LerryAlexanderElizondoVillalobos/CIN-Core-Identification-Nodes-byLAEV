# CIN Domain Core (migrated)

This is the migrated Rust domain foundation, copied from the existing `prototype/cin-core` implementation.

Includes:
- common document envelope and structural validation
- lifecycle transition model
- JSON Schema validation
- Genesis environment audit/manifest generation
- local storage repository and transactional commit markers
- recovery inspection/reporting
- CLI Genesis manifest and certificate runner

Build:
```sh
cargo test
cargo build --release
``

Migration note: the previous `prototype/cin-core` source remains temporarily for compatibility while CI and package workflows are moved. The package name remains `cin-core` so its Rust crate import `cin_core` stays stable.
