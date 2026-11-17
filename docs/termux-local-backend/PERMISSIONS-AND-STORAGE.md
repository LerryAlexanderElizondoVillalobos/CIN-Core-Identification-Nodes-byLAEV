# Permissions and Storage

**Version:** 1.4.0 · **Status:** Local runtime storage implemented; GitHub permissions remain proposed.

## GitHub permission boundary

Proposed future GitHub App permissions:
- Contents: read and write.
- Metadata: read-only.

Do not request Actions, Workflows, Administration, Issues, Packages or unrelated permissions for the initial backend. GitHub permissions are not enabled by the current pairing/persistence increment.

## Repository target

- Repository ID: `1458540194`
- Full name: `LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV`
- Existing CIN node folder: `Core Identification Node Github/CIN 001/`
- GitHub Pages publication root: `Core Identification Node Github/`

Before enabling writes, inspect existing CIN 001 record contracts and approve exact writable subdirectories. Do not assume every folder under CIN 001 is writable.

## Private Termux storage

The local backend stores its runtime snapshot at:

`$HOME/.cin-local-backend/data/runtime-state.json`

Set `CIN_DATA_DIR` to select another private application-data directory. The storage module creates the data directory with filesystem mode `0700` and writes the snapshot with mode `0600`. Snapshot replacement uses a temporary file and atomic rename.

Persisted data currently includes:
- Runtime pairing requests and their states.
- Polling secrets needed to complete a pending Lobby pairing.
- Active session metadata and session credentials required to restore a session after restart.
- Expiration and revocation states.
- Up to 2,000 recent pairing/session lifecycle events.

The Manager displays metadata only; it does not render secrets. Secrets are stored in the private state file protected by filesystem permissions and Termux's private app storage. They are not encrypted by a separate application-level encryption layer in this release. Do not copy the state file to shared Android storage, GitHub, GitHub Pages or another public location.

The current JSON snapshot store is designed for one local backend process. It is not a multi-process database, cloud synchronization system or automatic backup mechanism. Android uninstall, deletion of Termux app data, loss/corruption of the private home directory or manual deletion can still destroy the state. A future backup/export feature must preserve confidentiality and require explicit operator action.

## Public repository disclosure

Anything committed under `Core Identification Node Github/` is publicly readable and published by the current Pages workflow. Before a future write, the UI must display the exact destination and warn that it is public. Never commit private records, credentials, keys, access tokens, pairing secrets or unapproved personal data.

## Safe operation history

Record operation ID, timestamp, operation, repository ID, branch, relative path, result, commit SHA and safe error code. Do not store file contents or tokens in logs by default.
