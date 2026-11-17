# Architecture

**Version:** 1.3.0 · **Status:** Proposed

## Components

1. **CIN Genesis Lobby** — public HTTPS frontend on GitHub Pages.
2. **CIN Local Backend** — Node.js process in Termux, bound exclusively to loopback.
3. **CIN Backend Manager** — local administration UI served by the same backend origin.
4. **GitHub Device Flow client** — starts and polls the GitHub App device authorization flow; secrets/tokens remain in Termux.
5. **Repository adapter** — performs narrowly scoped read/create/update operations against the configured CIN repository.
6. **Private local storage** — holds credentials, pairing sessions, configuration and safe operation metadata.

No Cloudflare Worker or remote application backend is included in the target architecture.

## Topology

```text
Android browser
  ├── HTTPS → CIN GitHub Pages Lobby
  └── user-approved loopback request → http://127.0.0.1:2112
                                         └── Termux Node.js backend
                                               ├── Backend Manager
                                               ├── Pairing/session API
                                               ├── GitHub Device Flow
                                               ├── Repository adapter
                                               └── private local state
                                                     └── HTTPS → GitHub API
```

## Network settings

| Setting | Value |
|---|---|
| Bind address | `127.0.0.1` only |
| Default port | `2112` |
| Configurable alternative | `1221` |
| Manager path | `/manager` |
| Health path | `/health` |
| API prefix | `/api/v1/` |

The process must not bind to `0.0.0.0`. If 2112 is occupied, report the conflict or use 1221 only when explicitly configured. Report the actual bound endpoint; never silently choose a port the Lobby does not know.

## Browser compatibility gate

An HTTPS GitHub Pages origin calling an HTTP loopback endpoint is subject to browser local-network permission and address-space policies. CORS alone is not sufficient. Before implementing the complete connector, prove the request from the actual deployed Pages origin in the target Android browser, including preflight, user gesture, permission grant/denial and PWA mode if required. Follow the browser's current Local Network Access requirements; do not assume a universal `targetAddressSpace` syntax or cross-browser behavior.

If this proof fails, stop the Lobby integration phase and evaluate a supported alternative such as serving a local Lobby copy from the backend. Do not add an external Worker as a workaround.

## Pairing

A Lobby session is distinct from a GitHub token. The Manager must display and approve each initial pairing. Pairing credentials are random, revocable, limited to the configured Lobby origin and held in browser memory for the initial release. CORS is not authentication. Mutating requests require session authorization and origin/CSRF validation.

## Existing repository integration

The current Lobby uses Authorization Code + PKCE and calls the existing exchange Worker. Device Flow through Termux is a new path. Keep the current integration intact until Device Flow, loopback access, repository operations and rollback have been verified.

## Repository target

- Owner: `LerryAlexanderElizondoVillalobos`
- Repository: `CIN-Core-Identification-Nodes-byLAEV`
- Repository ID: `1458540194`
- Default branch: `main`
- GitHub Pages source directory: `Core Identification Node Github/`
- Existing CIN 001 directory: `Core Identification Node Github/CIN 001/`

The actual allowed write subtree must be finalized against the existing record contracts before enabling writes. The Pages workflow publishes the entire `Core Identification Node Github/` directory, so writes there are public.

## Data flow

1. Operator starts Termux backend.
2. Operator opens Backend Manager and connects GitHub through Device Flow.
3. Manager verifies the authenticated account and repository access.
4. Operator opens the GitHub Pages Lobby and approves pairing in Manager.
5. Lobby requests a scoped operation using its local session.
6. Backend validates repository, branch, operation and path.
7. Backend calls GitHub API and returns result metadata/commit SHA, never a GitHub token.
