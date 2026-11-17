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
| `configuration` | Local State Manager | Lobby origin, backend port, pairing request/session TTLs, event retention limit |
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
- Lobby origin: `https://lerryalexanderelizondovillalobos.github.io` (overridable at first initialization with `CIN_LOBBY_ORIGIN`)
- Backend port: `2112` (`CIN_LOCAL_BACKEND_PORT` overrides the persisted value)
- Pairing request TTL: 5 minutes
- Pairing session TTL: 24 hours
- Lifecycle event retention: 2,000 events

`updateConfiguration` validates known fields, HTTP(S) origin syntax, port range and positive integer durations. The local Backend Manager exposes `GET /api/v1/configuration` and `PUT /api/v1/configuration`. Lobby origin and pairing/event settings apply immediately to subsequent requests and newly created sessions. Existing expiry timestamps are preserved. Backend port changes are persisted and require a restart; `CIN_LOCAL_BACKEND_PORT` takes precedence over the saved port. Configuration routes are restricted to loopback-origin browser requests.

## Boundaries

- This is local runtime persistence, not a CIN foundational ledger.
- It does not replace the dedicated Merkle Tree engine or any foundational CIN record contract.
- It does not provide multi-process concurrency, cloud synchronization, automatic backup, application-level encryption or recovery after Termux app-data deletion.
- The snapshot currently stores pairing secrets required to resume sessions; private filesystem permissions are not equivalent to application-level encryption.
- Do not commit runtime state files to the public repository.

## Verification

Automated tests cover independent domain persistence, configuration validation and API updates, dynamic Lobby origin changes, pairing restoration across a backend restart and retained revocation history. A dedicated GitHub Actions workflow now runs `npm test` with Node.js 22 for relevant pull requests. Android/Termux acceptance remains a separate required verification.
