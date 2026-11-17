# CIN Local Backend — Termux

**Version:** 1.3.0  
**Status:** Specification and CI contract baseline; runtime not implemented  
**Repository:** LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV  
**Branch:** feat/termux-local-backend

## Purpose

Define a Node.js backend running locally in Android Termux. The existing CIN Genesis Lobby remains hosted on GitHub Pages and communicates with the local service through loopback. Termux owns GitHub Device Flow, token storage and repository operations. No Cloudflare Worker or remote application backend is part of the target architecture.

## Repository baseline discovered

The current repository already contains:
- GitHub Pages Lobby under `Core Identification Node Github/`.
- Browser-based GitHub App Authorization Code + PKCE in `cin-github-lobby.js`.
- Existing OAuth exchange Worker under `services/cin-github-oauth-worker/`.
- CI workflows `.github/workflows/ci.yml` and `.github/workflows/specification-validation.yml`.

This proposal introduces a new Termux Device Flow path. It is a migration, not a description of existing functionality. Preserve the current Lobby/Worker path until the Termux path passes the acceptance gates and a migration decision is approved.

## Fixed initial configuration

- Bind: `127.0.0.1` only.
- Default port: `2112`.
- Optional configured alternative: `1221`.
- Manager: `http://127.0.0.1:2112/manager`.
- API: `http://127.0.0.1:2112/api/v1/`.
- Frontend: deployed CIN GitHub Pages origin.
- Authentication: GitHub App Device Authorization Flow.
- Backend: Node.js in Termux.
- No Cloudflare Worker in the target design.

## Documents

- [Architecture](ARCHITECTURE.md)
- [API specification](API-SPECIFICATION.md)
- [Authentication](AUTHENTICATION.md)
- [Permissions and storage](PERMISSIONS-AND-STORAGE.md)
- [Termux installation and Manager](TERMUX-INSTALLATION.md)
- [Test plan](TEST-PLAN.md)
- [GitHub Actions](GITHUB-ACTIONS.md)
- [Implementation roadmap](IMPLEMENTATION-ROADMAP.md)

## Scope boundary

The backend is a local GitHub repository bridge for the Lobby. It is not the CIN portable runtime, node lifecycle engine, signing authority, certificate issuer or a personal registration authority. GitHub account linking authenticates the repository operator; it does not authorize CIN lifecycle events.

## Current maturity

Documentation and specification CI only. No Termux server, Manager, local API, Device Flow client, repository adapter or Android browser bridge is implemented yet. Passing the new CI checks validates this specification package only, not runtime behavior.
