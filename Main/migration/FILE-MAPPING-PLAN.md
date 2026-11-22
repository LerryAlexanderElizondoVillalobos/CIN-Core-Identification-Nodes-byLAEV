# Migration file mapping plan

This plan governs the restructuring of the existing repository into Linux-first CIN Main.

## Destination layers
- `Main/installation/linux`: bootstrap, install/uninstall, packaging and installation tests.
- `Main/installation/lindesk`: verified Android client integration docs/adapters.
- `Main/installation/bridge`: transport-neutral protocol contract and operation envelopes.
- `Main/core/runtime`: runtime entrypoint, process/service lifecycle and status.
- `Main/core/configuration`: defaults, schemas and config loading.
- `Main/core/module-manager`: module discovery, registry, dependencies and lifecycle.
- `Main/engines`: independently defined cryptographic, ledger, Merkle, permissions and signing capabilities.
- `Main/applications`: CIN applications and user-facing local workflows.
- `Main/storage`: persistent data and state layout.
- `Main/system/linux`: Linux integration, user services and platform helpers.
- `Main/tests`: Main-specific unit/integration/installer tests.

## Mapping policy
1. Preserve current source paths while inventory and migration are in progress.
2. Each component receives one disposition: KEEP (existing path), MOVE (destination recorded), REWRITE (new implementation required), ARCHIVE (historical source retained), or REMOVE (explicit rationale).
3. Migration must record source path, destination path, dependencies, test coverage, and behavior parity.
4. Root-level projects, workflows and research are not deleted simply because Main is created.
5. Only remove legacy files after migrated behavior has passed validation and any references have been updated.

## Current status
The new Main scaffold exists. The full repository inventory and per-file mapping are pending follow-up commits.
