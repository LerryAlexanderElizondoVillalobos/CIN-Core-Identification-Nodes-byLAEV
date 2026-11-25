# Main Core

**Implementation language:** Rust  
**Origin:** migrated from `prototype/cin-core/`  
**Maturity:** ported source; CI validation pending on this branch.

## Scope

This crate is the current home of the existing Rust domain foundation and first local Genesis/storage vertical slice. It deliberately has no UI or HTTP server responsibility.

## Migrated modules

| Source module | Current Main location | Observed capability |
|---|---|---|
| `error.rs` | `src/error.rs` | Shared typed errors/results |
| `lifecycle.rs` | `src/lifecycle.rs` | Explicit lifecycle transition model and tests |
| `data_root.rs` | `src/data_root.rs` | Configurable local data-root resolution |
| `documents/` | `src/documents/` | Common envelope and structural validation |
| `schema.rs` | `src/schema.rs` | JSON Schema 2020-12 validation |
| `storage/` | `src/storage/` | Filesystem repository and transactional record commit/read-back |
| `recovery.rs` | `src/recovery.rs` | Non-destructive storage inspection test support |
| `genesis/` | `src/genesis/` | Purpose-limited environment audit, Genesis Manifest build and registration |

CLI entry points:
- `cin-genesis-manifest`
- `cin-certificate-runner`

## Important implementation limits

- Existing TransactionalStore is explicitly a single-process, single-writer prototype; it does not claim multi-process locking or directory-fsync power-loss guarantees.
- Its SHA-256 digest covers the exact serialized JSON bytes. It is not RFC 8785 JCS canonicalization, a detached signature, issuer trust or authorization.
- Genesis creates and registers a candidate manifest; this is not a production-signed certificate.
- The existing recovery inspector has test-only visibility in its current implementation; a supported production recovery API remains to be specified.
- This crate does not yet implement the complete birth, personal registration, credential, evidence, profile, Lobby or engine-manager lifecycle.

## Build and test

From repository root:

```sh
cargo fmt --manifest-path Main/core/Cargo.toml --all -- --check
cargo clippy --manifest-path Main/core/Cargo.toml --all-targets -- -D warnings
cargo test --manifest-path Main/core/Cargo.toml --all-targets
```

## Migration provenance

Source tree remains preserved at `prototype/cin-core/` until Main/core passes CI and a source/consumer audit confirms that all relevant imports, scripts, docs and workflows have been updated. Source SHA references and migration disposition are recorded in `HISTORIAL/migration-register/MAIN_MIGRATION_REGISTER.md`.

## Maturity gate

Current state: **ported, not yet CI-accepted**. Do not label the crate production-ready until the branch workflow passes and storage/crypto/Genesis limitations are resolved by their own contracts.
