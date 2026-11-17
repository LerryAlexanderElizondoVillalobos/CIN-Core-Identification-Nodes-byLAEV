# API Specification

**Version:** 1.5.0 · **Status:** Runtime, initial pairing lifecycle and local persistence implemented; OAuth and repository operations remain planned.

Base URL: `http://127.0.0.1:2112/api/v1/`

## Implemented foundation routes

- `GET /health`
- `GET /api/v1/status`
- `GET /manager`

## Implemented pairing routes

- `POST /api/v1/pairing/request`
- `GET /api/v1/pairing/status`
- `GET /api/v1/pairing/status?request_id=...&poll_secret=...`
- `POST /api/v1/pairing/approve`
- `POST /api/v1/pairing/reject`
- `POST /api/v1/pairing/revoke`

Pairing requests expire after five minutes. Approved sessions expire after 24 hours. The local Manager can inspect requests, sessions and recent lifecycle events.

## Persistence

The CIN Local State Manager persists pairing requests, session records, active session credentials, revocation/expiry state, runtime configuration and named state domains in a schema-versioned JSON snapshot. Schema v1 is migrated to v2 without dropping pairing records. The local Manager exposes the storage status and state-domain inventory. Default path:

`$HOME/.cin-local-backend/data/runtime-state.json`

Override with `CIN_DATA_DIR`. The directory uses mode `0700`; the state file uses mode `0600`. Updates use a temporary file, file synchronization and atomic rename. State is restored when the backend starts. See [LOCAL-STATE-MANAGER.md](./LOCAL-STATE-MANAGER.md) and [PAIRING-ENGINE-IMPLEMENTATION.md](./PAIRING-ENGINE-IMPLEMENTATION.md).

This increment does not provide application-level encryption, automatic backup, multi-process concurrent writes, or cloud synchronization. Uninstalling Termux or deleting its private data can remove the state.

## Conventions

- JSON UTF-8 requests and responses.
- The Manager and API share one local origin.
- Lobby CORS is restricted to the configured Lobby origin.
- The backend binds to `127.0.0.1`.
- The Manager never displays pairing or session secrets.
- GitHub OAuth, repository access and write operations are not implemented in this increment.

## Planned endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/auth/status` | Safe GitHub connection status |
| POST | `/api/v1/auth/device/start` | Start Device Flow |
| GET | `/api/v1/auth/device/status` | Read safe flow status |
| POST | `/api/v1/auth/disconnect` | Disconnect GitHub |
| GET | `/api/v1/repository/info` | Verify configured repository |
| GET | `/api/v1/repository/tree?path=...` | List permitted directory |
| GET | `/api/v1/repository/file?path=...` | Read permitted file |
| POST | `/api/v1/repository/file` | Create file |
| PUT | `/api/v1/repository/file` | Update file with current SHA |
| GET | `/api/v1/operations/history` | Safe operation history |

## Repository constants

The browser cannot override owner, repository or branch. Initial target:

- Owner: `LerryAlexanderElizondoVillalobos`
- Repository: `CIN-Core-Identification-Nodes-byLAEV`
- Repository ID: `1458540194`
- Branch: `main` initially, configurable only by backend operator.

## Write contract

Repository writes remain out of scope until pairing, permissions and local persistence have passed validation. Before enabling writes, inspect existing CIN record contracts and approve exact writable subdirectories.

## Initial error codes

`BACKEND_NOT_READY`, `PAIRING_REQUIRED`, `PAIRING_EXPIRED`, `PAIRING_REVOKED`, `GITHUB_NOT_CONNECTED`, `GITHUB_AUTH_PENDING`, `GITHUB_AUTH_EXPIRED`, `GITHUB_PERMISSION_DENIED`, `REPOSITORY_PATH_DENIED`, `FILE_NOT_FOUND`, `FILE_ALREADY_EXISTS`, `REPOSITORY_CONFLICT`, `GITHUB_RATE_LIMITED`, `GITHUB_UNAVAILABLE`, `INVALID_REQUEST`.

## Excluded from this increment

File deletion, repository administration, arbitrary API proxying, Actions/Workflows management, branch protection changes, credential export and CIN lifecycle issuance/signing.
