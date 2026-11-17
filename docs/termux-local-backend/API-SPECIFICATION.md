# API Specification

**Version:** 1.4.0 · **Status:** Runtime foundation and first pairing routes implemented; authentication and repository routes remain planned

Base URL: `http://127.0.0.1:2112/api/v1/`

## Implemented foundation routes

The current branch contains a read-only first runtime slice:
- `GET /health`
- `GET /api/v1/status`
- `GET /manager`

These routes provide the loopback runtime foundation. Pairing request, status, approval, rejection and revocation routes have an initial implementation on `feat/pairing-engine-backend-manager`. Authentication and repository endpoints remain planned.

## Conventions

- JSON UTF-8 requests/responses.
- Manager and API share one origin.
- Mutations require an approved local pairing session.
- GitHub tokens and device codes are never returned to the Lobby.
- Errors use stable codes and safe messages.
- No arbitrary GitHub API proxy.

## Initial endpoint contract

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Liveness |
| GET | `/api/v1/status` | Runtime and subsystem status |
| GET | `/api/v1/auth/status` | Safe GitHub connection status |
| POST | `/api/v1/pairing/request` | Request Lobby pairing |
| GET | `/api/v1/pairing/status` | Read pairing state |
| POST | `/api/v1/pairing/approve` | Manager approval |\n| POST | `/api/v1/pairing/reject` | Manager rejection |
| POST | `/api/v1/pairing/revoke` | Revoke local session |
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

Create body:

```json
{
  "path": "relative/path/inside/approved-root.json",
  "content": "{\"example\":true}",
  "message": "Add CIN artifact"
}
```

Update body includes `expected_sha` when the UI has a previously read version. The backend independently fetches the current blob SHA and uses it for the GitHub Contents API update. Conflicts must be surfaced; never silently overwrite.

The backend derives the full repository path from its configured write root. The client cannot supply an absolute path, repository, owner or arbitrary branch.

## Response envelope

```json
{"ok":true,"data":{},"request_id":"opaque-id"}
```

```json
{"ok":false,"error":{"code":"REPOSITORY_CONFLICT","message":"The file changed remotely; reload before retrying."},"request_id":"opaque-id"}
```

## Initial error codes

`BACKEND_NOT_READY`, `PAIRING_REQUIRED`, `PAIRING_EXPIRED`, `PAIRING_REVOKED`, `GITHUB_NOT_CONNECTED`, `GITHUB_AUTH_PENDING`, `GITHUB_AUTH_EXPIRED`, `GITHUB_PERMISSION_DENIED`, `REPOSITORY_PATH_DENIED`, `FILE_NOT_FOUND`, `FILE_ALREADY_EXISTS`, `REPOSITORY_CONFLICT`, `GITHUB_RATE_LIMITED`, `GITHUB_UNAVAILABLE`, `INVALID_REQUEST`.

## Pairing implementation note\n\nThe first implementation uses in-memory request/session state. Requests expire after five minutes and sessions after 24 hours. A process restart clears both. The Lobby receives a session token by polling with its request ID and polling secret. The Manager lists metadata only. See [PAIRING-ENGINE-IMPLEMENTATION.md](./PAIRING-ENGINE-IMPLEMENTATION.md) for the lifecycle and validation requirements.\n\n## Excluded from v1

File deletion, repository administration, arbitrary API proxying, Actions/Workflows management, branch protection changes, credential export and CIN lifecycle issuance/signing.
