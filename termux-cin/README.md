# CIN Local Backend — Termux / Android

**Selected deployment:** same Android device, Node.js runtime.

This service connects the public CIN GitHub Pages Lobby to a Node.js process running locally in Termux. It replaces the previously drafted Cloudflare Worker OAuth exchange. The GitHub App client secret and the operator's GitHub access token stay in Termux memory/configuration; neither is published to GitHub Pages.

## Architecture boundaries

- **GitHub authentication:** OAuth Authorization Code + PKCE exchange in `src/github/oauth.js`.
- **GitHub repository access:** scoped API connector in `src/github/connector.js`; only the configured CIN repository and `/user` are accepted.
- **CIN authorization:** separate permission-request engine in `src/authorization/permission-engine.js`. A GitHub login does not approve CIN issuance or other domain actions.
- **Signing:** separate adapter interface in `src/signatures/signature-interface.js`. No private signing key is generated or stored here. A future USB/external signer can be connected through the adapter.
- **Transport:** local HTTP listener bound to `127.0.0.1`; CORS accepts only the published CIN Pages origin and supports browser private-network preflight.

## Install in Termux

Install Node.js 20 or later, then:

```sh
pkg update
pkg install nodejs
cd ~/CIN-Core-Identification-Nodes-byLAEV/termux-cin
cp .env.example .env
nano .env
npm run check
npm start
```

Fill the GitHub App Client ID and Client Secret in the local `.env` file. Do not paste the secret into chat, GitHub, the Pages configuration, or a committed file. Keep `.env` only on the Android device.

The GitHub App callback URL must exactly equal `CIN_GITHUB_REDIRECT_URI`. Enable user authorization and grant only the repository permissions required by the CIN workflow (Contents read/write and Metadata read-only). Install the App on the CIN repository.

## Local endpoint

- `GET http://127.0.0.1:8787/health`
- `GET http://127.0.0.1:8787/v1/status`
- `POST http://127.0.0.1:8787/oauth/exchange` (PKCE code exchange)
- `GET|PUT http://127.0.0.1:8787/v1/github/...` (scoped GitHub API proxy)

Open the GitHub Pages Lobby in the browser on the **same Android device** where Termux is running. The browser talks to loopback; no public backend port is opened. Keep Termux running while using the Lobby.

## Session behavior

The GitHub access token is held in process memory only. Restarting Termux or stopping the server clears the session; reconnect GitHub from the Lobby. No token persistence, localStorage token, or repository token file is used.

## Scope and current implementation

This first backend slice provides local health/status, PKCE exchange, in-memory GitHub session, and a repository-scoped API proxy. The permission engine and signing adapter are separate foundations and are not yet wired to issuance workflows. The existing Lobby's Genesis and node-birth flows can use the scoped GitHub connector once its public config points to this backend.

This does not yet make CIN records private: files committed to the public GitHub repository remain publicly readable. Do not store private personal records or signing material in public repository paths.
