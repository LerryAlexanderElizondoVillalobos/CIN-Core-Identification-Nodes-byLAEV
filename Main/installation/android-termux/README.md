# CIN Local Backend — Termux / Android

**Selected deployment:** same Android device, Node.js runtime.

This service connects the public CIN GitHub Pages Lobby to a Node.js process running locally in Termux. It replaces the previously drafted Cloudflare Worker OAuth exchange. The GitHub App client secret and the operator's GitHub access token stay in Termux memory/configuration; neither is published to GitHub Pages.

## Architecture boundaries

- **GitHub authentication:** OAuth Authorization Code + PKCE exchange in `src/github/oauth.js`.
- **GitHub repository access:** scoped API connector in `src/github/connector.js`; only the configured CIN repository and `/user` are accepted.
- **CIN authorization:** separate permission-request engine in `src/authorization/permission-engine.js`. A GitHub login does not approve CIN issuance or other domain actions.
- **Signing:** separate adapter interface in `src/signatures/signature-interface.js`. No private signing key is generated or stored here. A future USB/external signer can be connected through the adapter.
- **Local workspace:** file access to the cloned `Core Identification Node Github/` directory through `src/workspace/local-directory.js`.
- **Transport:** local HTTP listener bound to `127.0.0.1`; CORS accepts only the published CIN Pages origin and supports browser private-network preflight.

## Install in Termux

Install Git and Node.js 20 or later, then clone the repository if needed:

```sh
pkg update
pkg install git nodejs
cd ~
git clone https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV.git
cd ~/CIN-Core-Identification-Nodes-byLAEV/termux-cin
cp .env.example .env
nano .env
npm run check
npm start
```

Fill the GitHub App Client ID and Client Secret in the local `.env` file. Do not paste the secret into chat, GitHub, the Pages configuration, or a committed file. Keep `.env` only on the Android device.

In GitHub App settings, set the Homepage URL to the CIN Pages URL, the callback URL to the exact value of `CIN_GITHUB_REDIRECT_URI`, enable user authorization, and install the App on this repository with **Contents: Read and write** and **Metadata: Read-only** permissions.

Then edit `Core Identification Node Github/cin-github-config.js` in the repository and replace `CONFIGURE_PUBLIC_GITHUB_APP_CLIENT_ID` with the App's public Client ID. This Client ID is public; the Client Secret is not. Commit and publish that one-line public configuration change.

The GitHub App callback URL must exactly equal `CIN_GITHUB_REDIRECT_URI`. Enable user authorization and grant only the repository permissions required by the CIN workflow (Contents read/write and Metadata read-only). Install the App on the CIN repository.

## Local endpoint

- `GET http://127.0.0.1:8787/health`
- `GET http://127.0.0.1:8787/v1/status`
- `GET http://127.0.0.1:8787/v1/local/tree` (list the local CIN workspace)
- `GET http://127.0.0.1:8787/v1/local/file?path=...` (read a local file)
- `PUT http://127.0.0.1:8787/v1/local/file` with `{ "path": "...", "content": "..." }` (write a local text file)
- `POST http://127.0.0.1:8787/oauth/exchange` (PKCE code exchange)
- `GET|PUT http://127.0.0.1:8787/v1/github/...` (scoped GitHub API proxy)

Open the GitHub Pages Lobby in the browser on the **same Android device** where Termux is running. The browser talks to loopback; no public backend port is opened. Keep Termux running while using the Lobby.

## Session behavior

The GitHub access token is held in process memory only. Restarting Termux or stopping the server clears the session; reconnect GitHub from the Lobby. No token persistence, localStorage token, or repository token file is used.

## Scope and current implementation

This first backend slice provides local health/status, local CIN directory listing/read/write, PKCE exchange, in-memory GitHub session, and a repository-scoped API proxy. The permission engine and signing adapter are separate foundations and are not yet wired to issuance workflows. The existing Lobby's Genesis and node-birth flows can use the scoped GitHub connector once its public config points to this backend.

This does not yet make CIN records private: files committed to the public GitHub repository remain publicly readable. Do not store private personal records or signing material in public repository paths.
