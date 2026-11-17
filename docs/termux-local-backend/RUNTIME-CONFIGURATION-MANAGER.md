# CIN Runtime Configuration Manager

**Component:** Local Runtime Control Plane  
**Branch:** `feat/pairing-engine-backend-manager`  
**Status:** Implemented; automated Node.js tests pass; Android acceptance pending.

## Purpose

The Runtime Configuration Manager gives the operator a graphical interface to configure the local Termux backend without editing source files. It uses the Local State Manager as the durable configuration store.

## Operator settings

| Setting | Default | Application |
|---|---:|---|
| Lobby origin | `https://lerryalexanderelizondovillalobos.github.io` | Immediately changes the accepted Lobby CORS origin |
| Backend port | `2112` | Persisted; applied on next backend restart |
| Pairing request expiry | 5 minutes | Applies to newly created requests |
| Session expiry | 24 hours | Applies to newly approved sessions |
| Lifecycle event retention | 2,000 | Applies immediately; trims retained history when reduced |

The environment variable `CIN_LOCAL_BACKEND_PORT` takes precedence over the persisted backend port. The Lobby origin can be seeded on first initialization using `CIN_LOBBY_ORIGIN`; subsequent changes are persisted in the configuration domain.

Existing request/session expiry timestamps are not rewritten when a duration changes. The new duration governs newly created records.

## API contract

- `GET /api/v1/configuration`
- `PUT /api/v1/configuration`

The PUT body is a partial JSON object containing one or more known settings. Unknown fields, invalid HTTP(S) origins, out-of-range ports and non-positive integer durations are rejected with `400 INVALID_CONFIGURATION`.

Configuration routes are intended for the local Backend Manager and reject browser Origin headers that are not loopback. The API is not exposed as a Lobby configuration surface.

The response includes `restart_required` when the saved port differs from the port currently serving the Manager.

## Operational behavior

- Lobby CORS checks read the persisted origin on each request, so a saved origin change applies immediately.
- Pairing Engine lifecycle settings are reconfigured after a successful save.
- The backend port is selected at process startup from `CIN_LOCAL_BACKEND_PORT`, then persisted configuration, then the default.
- The UI loads persisted settings once on page initialization and does not overwrite unsaved form edits during its periodic status refresh.

## Verification

The backend test suite validates configuration persistence, validation failures, live Lobby-origin changes, saved port restart indication and port selection from persisted configuration. GitHub Actions workflow `CIN Local Backend Tests` runs `npm test` with Node.js 22 for relevant pull requests.

Manual Android acceptance remains required: change each setting in Termux Manager, restart for a port change, confirm the service binds to the selected port, and verify the deployed Lobby origin against the configured value.
