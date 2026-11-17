# Termux Installation and Backend Manager

**Version:** 1.3.0 · **Status:** Proposed; no installer/runtime released

## Runtime

- Android + Termux.
- Node.js LTS available from Termux package repositories at implementation time.
- Loopback bind: `127.0.0.1`.
- Default port: `2112`; optional configured alternative `1221`.

## Proposed setup

Commands below are an initial target and must be tested against the selected Termux distribution before being published as a supported installer:

```bash
pkg update
pkg install nodejs-lts git
mkdir -p ~/cin-local-backend
cd ~/cin-local-backend
```

The implementation must ship a pinned dependency manifest/lockfile. Do not pipe an unreviewed remote script into a shell.

## Manager sections

1. Dashboard: process, uptime, bind address, port and health.
2. GitHub: Device Flow, connected account, permission status and disconnect.
3. Repository: owner, name, ID, branch and approved root.
4. Pairing: pending Lobby requests, approve and revoke.
5. Activity: operation metadata and commit references.
6. Configuration: Pages origin, port and repository settings.
7. Diagnostics: sanitized runtime checks and logs.

## Proposed source layout

```text
services/cin-local-backend/
  package.json
  src/
    server.js
    config.js
    api/
    auth/
    github/
    pairing/
    permissions/
    storage/
    manager/
  test/
```

This is a target layout, not an assertion that the runtime currently exists.

## Process lifecycle

Provide explicit Termux start/stop commands. The Manager may request graceful shutdown; it cannot restart a process that is no longer running unless a separately validated Android launcher/supervisor is installed. Android may reclaim background processes; test screen-off, battery optimization, force-stop and device restart behavior. Do not claim guaranteed persistence in the background.

## Port selection

Use 2112 by default. Use 1221 only when explicitly configured or selected by the operator after a conflict. Report the actual bound endpoint to the Manager and Lobby; never silently change ports.
