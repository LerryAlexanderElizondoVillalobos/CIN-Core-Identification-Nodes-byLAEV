# Pairing Engine and Backend Manager

**Implementation branch:** `feat/pairing-engine-backend-manager`  
**Base branch:** `feat/termux-local-backend`  
**Status:** Persistent local state implemented; Android/Termux and deployed Lobby validation pending.

## Scope

Implements local Lobby-to-Termux pairing, the local Manager interface, and durable storage for runtime state. It does not implement GitHub OAuth/Device Flow, repository operations, signing, or repository writes.

## Pairing lifecycle

1. The Lobby calls `POST /api/v1/pairing/request`.
2. The backend creates a request ID and polling secret. Pending requests expire after five minutes.
3. The operator reviews the request in `/manager`.
4. The operator approves or rejects it.
5. Approval creates a session with a random session ID and session secret. Sessions expire after 24 hours.
6. The Lobby polls `GET /api/v1/pairing/status?request_id=...&poll_secret=...` to retrieve the session credential.
7. The Manager can inspect active sessions and revoke them.

## Persistent local state

The runtime uses `src/local-state-manager.js` over `src/persistent-store.js` to save a versioned JSON state file. The Local State Manager exposes named state domains and owns runtime configuration; the Pairing Engine uses it as its persistence adapter. The default Termux path is:

`$HOME/.cin-local-backend/data/runtime-state.json`

Override the directory with `CIN_DATA_DIR`. The containing directory is created with mode `0700`; the state file is written with mode `0600`. Writes use a temporary file followed by atomic rename so an interrupted write does not replace the previous complete snapshot.

Snapshot schema version 2 adds named runtime domains while preserving the version-1 pairing arrays during migration. File contents are synchronized before atomic replacement. See [LOCAL-STATE-MANAGER.md](./LOCAL-STATE-MANAGER.md) for the state-domain contract.

The state file contains:
- Pairing requests, their lifecycle states and polling secrets.
- Session metadata, active session credentials, expiry and revocation state.
- A bounded lifecycle event history (latest 2,000 events).

On startup the engine restores the snapshot and immediately evaluates expirations. Active sessions that have not expired remain active after a normal backend restart. Expired sessions are marked `EXPIRED`; revoked sessions remain recorded as `REVOKED`. Request and session history is available to the local Manager. The Manager displays only metadata and event history, never session or polling secrets.

The state file is private local application data, not a backup or synchronization service. A malformed or unsupported snapshot stops startup visibly instead of silently resetting state. Android uninstall, manual deletion, storage corruption or loss of the Termux home directory can still remove it. Current persistence uses filesystem permissions and Termux's private storage; application-level encryption and export/import are not part of this increment. Users should not copy this file into the public repository or shared storage.

## Implemented routes

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/v1/pairing/request` | Create pending request |
| GET | `/api/v1/pairing/status` | Manager list of requests, sessions and recent events |
| GET | `/api/v1/pairing/status?request_id=...&poll_secret=...` | Lobby polls its request |
| POST | `/api/v1/pairing/approve` | Operator approves pending request |
| POST | `/api/v1/pairing/reject` | Operator rejects pending request |
| POST | `/api/v1/pairing/revoke` | Operator revokes active session |

## Runtime configuration\n\nThe local Manager provides persistent configuration for the Lobby origin, backend port, pairing request TTL, session TTL and event-history retention. Lobby origin and lifecycle settings apply immediately to subsequent requests/new records; backend port changes require a restart. See [RUNTIME-CONFIGURATION-MANAGER.md](./RUNTIME-CONFIGURATION-MANAGER.md) and [API-SPECIFICATION.md](./API-SPECIFICATION.md).\n\n## Current boundaries and limitations

- Backend remains bound to `127.0.0.1`.
- Lobby origin defaults to `https://lerryalexanderelizondovillalobos.github.io` and can be overridden with `CIN_LOBBY_ORIGIN`.
- Local Manager requests are same-origin loopback requests.
- Session authorization helper exists, but no repository operations are implemented or protected yet.
- Persistence is synchronous JSON snapshot storage; suitable for the current single-process local runtime, not concurrent multi-process writers.
- Secrets in the state file are protected by private directory/file permissions, not encrypted at application level.
- Browser Local Network Access behavior must be verified from the deployed Lobby on the target Android browser.
- The current Lobby still needs to be wired to the request/poll contract.

## Manager

The Manager is served at `http://127.0.0.1:2112/manager`. It displays runtime state, pending requests, active sessions, approval, rejection, revocation, persistent-storage status and recent lifecycle events.

## Verification required

Run `npm test` in `services/cin-local-backend` with Node.js 22 or newer. Tests include a backend restart between approval and polling and verify that session state and revocation history survive.

Then test on Termux:
- Stop and restart the backend without deleting its data directory.
- Confirm pending requests and active sessions restore.
- Confirm an expired session is not active after restart.
- Confirm revocation remains recorded.
- Test the deployed Lobby's browser permission and end-to-end polling.
- Confirm state survives Android process termination; separately document that uninstall or deletion of Termux data does not.

Do not enable OAuth or repository writes until pairing and persistence are validated.

## Architectural boundary

This branch changes only the local backend, its Manager, tests and supporting documentation. CIN foundational engines remain untouched.
