# CIN Local State Manager

**Component:** Local Runtime Infrastructure  
**Branch:** `feat/pairing-engine-backend-manager`  
**Status:** Initial implementation integrated with the Pairing Engine.

## Purpose

The Local State Manager is the single local persistence boundary for the CIN Termux runtime. Runtime modules should use named state domains rather than inventing independent files or storage formats.

The current implementation keeps one versioned snapshot at:

`$HOME/.cin-local-backend/data/runtime-state.json`

Override the containing directory with `CIN_DATA_DIR`.

## State domains

| Domain | Owner | Current contents |
|---|---|---|
| `configuration` | Local State Manager | Lobby origin, pairing request/session TTLs, event retention limit |
| `pairing` | Pairing Engine | Pairing requests, sessions and lifecycle events (stored in snapshot root for v1 compatibility) |
| `operations` | Future Operation Engine | Reserved operation-history domain |
| `installed_engines` | Future installer | Reserved for engine installation metadata |
| Additional named domains | Respective runtime module | Persisted module-owned state |

The public domain API is:
- `getDomain(name)`
- `setDomain(name, value)`
- `updateDomain(name, updater, initialValue)`
- `updateConfiguration(patch)`
- `status()`

Each read returns a structured clone. Each update writes a complete snapshot before returning. Reserved domains cannot be overwritten through the generic API.

## Snapshot and migration

Snapshot schema version 2 adds a `domains` object while retaining the existing top-level pairing arrays. Schema version 1 is accepted and migrated on startup without dropping pairing requests, sessions or events.

The file store writes a temporary file, synchronizes file contents, atomically renames it over the previous snapshot and attempts to synchronize the containing directory. The data directory and state file use filesystem modes `0700` and `0600`.

If the snapshot is malformed or has an unsupported schema, startup fails visibly instead of silently replacing it with empty state. This prevents an unreadable state file from being mistaken for a fresh installation.

## Runtime configuration

Initial configuration is:
- Lobby origin: `https://lerryalexanderelizondo.github.io` (overridable at first initialization with `CIN_LOBBY_ORIGIN`)
- Pairing request TTL: 5 minutes
- Pairing session TTL: 24 hours
- Lifecycle event retention: 2,000 events

`updateConfiguration` validates known fields and HTTP(S) origin syntax. The Pairing Engine receives the persisted configuration at startup. Configuration changes made through the state API are picked up by the next backend start; a live reconfiguration endpoint is not included yet.

## Boundaries

- This is local runtime persistence, not a CIN foundational ledger.
- It does not replace the dedicated Merkle Tree engine or any foundational CIN record contract.
- It does not provide multi-process concurrency, cloud synchronization, automatic backup, application-level encryption or recovery after Termux app-data deletion.
- The snapshot currently stores pairing secrets required to resume sessions; private filesystem permissions are not equivalent to application-level encryption.
- Do not commit runtime state files to the public repository.

## Verification

Automated tests cover independent domain persistence, configuration validation, pairing restoration across a backend restart and retained revocation history. These tests are added to the Node test suite but still require execution under Node.js 22+ and subsequent verification on the target Android/Termux device.
