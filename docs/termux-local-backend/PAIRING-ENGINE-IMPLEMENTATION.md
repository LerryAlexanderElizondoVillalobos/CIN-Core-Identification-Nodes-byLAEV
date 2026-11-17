# Pairing Engine and Backend Manager

**Implementation branch:** `feat/pairing-engine-backend-manager`  
**Base branch:** `feat/termux-local-backend`  
**Status:** First functional increment; validation on Android browser remains pending.

## Scope

This increment implements the local Lobby-to-Termux pairing lifecycle and upgrades the existing Manager page. It does not implement GitHub OAuth/Device Flow, repository operations, signing, or writes.

## Pairing lifecycle

1. The Lobby calls `POST /api/v1/pairing/request` with an optional display label.
2. The backend creates a random request ID and a separate polling secret. The request expires after five minutes.
3. The operator opens `/manager` and reviews pending requests.
4. The operator approves or rejects the request.
5. On approval, the backend creates a random session ID and session secret. The session expires after 24 hours.
6. The Lobby polls `GET /api/v1/pairing/status?request_id=...&poll_secret=...` and receives the session secret after approval.
7. The Manager can inspect active sessions and revoke them.

The polling secret is required to read the result for a request. Session secrets are returned only to the holder of that polling secret. The Manager list displays metadata, never secrets.

## Implemented routes

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/v1/pairing/request` | Create pending request |
| GET | `/api/v1/pairing/status` | Manager list of requests and sessions |
| GET | `/api/v1/pairing/status?request_id=...&poll_secret=...` | Lobby polls its request |
| POST | `/api/v1/pairing/approve` | Operator approves pending request |
| POST | `/api/v1/pairing/reject` | Operator rejects pending request |
| POST | `/api/v1/pairing/revoke` | Operator revokes active session |

## Current runtime behavior and limitations

- The backend remains bound to `127.0.0.1`.
- The configured Lobby origin defaults to `https://lerryalexanderelizondo.github.io` and can be overridden with `CIN_LOBBY_ORIGIN`.
- Local Manager requests from the loopback origin are accepted.
- Pairing requests expire after five minutes; sessions expire after 24 hours.
- Session and request state currently lives in process memory. Restarting Termux clears it.
- The session authorization helper is available to subsequent protected API routes; this increment does not yet gate repository operations because repository operations are not implemented.
- Browser Local Network Access behavior must still be verified from the deployed GitHub Pages origin on the target Android browser. CORS configuration alone does not establish browser permission or session trust.
- The current Lobby must be wired to the pairing request/poll contract in a separate integration step.

## Manager

The Manager is served by the existing local backend at `http://127.0.0.1:2112/manager`. It now shows runtime state, pending requests, active sessions, approval, rejection and revocation.

## Verification still required

- Run `npm test` in `services/cin-local-backend` using Node.js 22 or newer.
- Start the service in Termux and verify the Manager on Android.
- Test pairing from the deployed Lobby origin, including browser preflight and Local Network Access permission.
- Confirm approval, polling, rejection, expiry, restart behavior and revocation.
- Do not enable OAuth or repository writes until this pairing stage is validated.

## Architectural boundary

This work is isolated from CIN's foundational engines. No foundational engine files are changed by this branch.
