# Permissions and Storage

**Version:** 1.3.0 · **Status:** Proposed

## GitHub permission boundary

Proposed GitHub App permissions:
- Contents: read and write.
- Metadata: read-only.

Do not request Actions, Workflows, Administration, Issues, Packages or unrelated permissions for the initial backend.

GitHub Contents permissions apply at repository level, not individual directory level. The directory restriction described here is enforced by the local backend and is not a GitHub security boundary.

## Repository target

- Repository ID: `1458540194`
- Full name: `LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV`
- Existing CIN node folder: `Core Identification Node Github/CIN 001/`
- GitHub Pages publication root: `Core Identification Node Github/`

Before enabling writes, inspect the existing CIN 001 record contracts and approve exact writable subdirectories. Do not assume every folder under CIN 001 is writable. Do not redirect writes to a new root.

## Path handling

- Accept repository-relative paths only.
- Reject absolute paths, parent traversal, empty path segments and paths outside the configured root.
- Normalize before every operation.
- Do not accept repository owner/name or branch overrides from the Lobby.
- Use an explicit list of permitted operation types and file formats.
- Use the GitHub Contents API SHA for updates and surface conflicts.
- No delete operation in the initial release.

## Private Termux storage

Store tokens, device-flow state, pairing secrets, session state, configuration and private operation metadata in Termux's private app storage. Do not use shared Android storage, the repository or Pages assets for secrets. Restrict file permissions and redact credentials from logs.

## Public repository disclosure

Anything committed under `Core Identification Node Github/` is publicly readable and published by the current Pages workflow. Before a write, the UI must display the exact destination and warn that it is public. Never commit private registration records, private credentials, keys, access tokens, pairing secrets or unapproved personal data. Git history remains accessible after later edits.

## Safe operation history

Record operation ID, timestamp, operation, repository ID, branch, relative path, result, commit SHA and safe error code. Do not store file contents or tokens in logs by default.
