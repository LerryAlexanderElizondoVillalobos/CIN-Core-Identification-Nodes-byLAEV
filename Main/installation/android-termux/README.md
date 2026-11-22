# CIN Local Backend — Termux / Android

**Android-side integration:** Node.js runtime in Termux, migrated into CIN Main.

This service connects the public CIN GitHub Pages Lobby to a Node.js process running locally in Termux. GitHub App credentials and access tokens remain local to the Android environment; secrets are not published to GitHub Pages or committed.

## Main-owned location
`Main/installation/android-termux/`

## Architecture boundaries
- GitHub authentication: OAuth Authorization Code + PKCE.
- Repository access: scoped GitHub connector.
- CIN authorization: separate permission-request engine.
- Signing: external signer interface; no private signing key is generated or stored here.
- Local workspace: access to the `Core Identification Node Github/` publication source.
- Transport: local HTTP listener bound to `127.0.0.1`.

## Setup in Termux
From a cloned CIN repository:
```sh
pkg update
pkg install git nodejs
cd ~/CIN-Core-Identification-Nodes-byLAEV/Main/installation/android-termux
bash install.sh
cp .env.example .env
nano .env
npm start
``
The installer checks Node.js and syntax. Keep the local `.env` on the device and do not commit it. Configure the GitHub App callback to match `CIN_GITHUB_REDIRECT_URI` and use only repository permissions needed by the workflow.

## Local endpoints
- `GET http://127.0.0.1:8787/health`
- `GET http://127.0.0.1:8787/v1/status`
- `GET http://127.0.0.1:8787/v1/local/tree`
- `GET http://127.0.0.1:8787/v1/local/file?path=...`
- `PUT http://127.0.0.1:8787/v1/local/file`
- `POST http://127.0.0.1:8787/oauth/exchange`
- `GET|PUT http://127.0.0.1:8787/v1/github/...`

Open the Pages Lobby in the same Android device where Termux runs. Tokens are held in memory; restarting the server clears the session.

## Current scope
The backend supports local health/status, workspace listing/read/write, PKCE exchange, in-memory GitHub session, and a repository-scoped API proxy. Permission and signer interfaces are separate foundations and not yet wired into issuance flows.

Files committed to the public GitHub repository remain public. This backend does not make public repository data private.
