# Linux User Installer

## Purpose

Install CIN Main for the current Linux user without requiring root privileges for the normal installation, launch, update or removal flow.

## Target locations

- Versioned releases: `${CIN_INSTALL_HOME:-$HOME/.local/opt/cin}/releases/<version>/`.
- Active release: `${CIN_INSTALL_HOME:-$HOME/.local/opt/cin}/current`.
- Launcher: `$XDG_BIN_HOME/cin` when configured, otherwise `~/.local/bin/cin`.
- Desktop entry: `$XDG_DATA_HOME/applications/cin.desktop` (default `~/.local/share/applications/cin.desktop`).
- Persistent node data: `$XDG_DATA_HOME/cin/`.
- Configuration: `$XDG_CONFIG_HOME/cin/`.
- Cache: `$XDG_CACHE_HOME/cin/`.

The installer root is configurable through `CIN_INSTALL_HOME`; the launcher, desktop entry, configuration, data and cache use the appropriate XDG base directories.

## Installer flow

1. Obtain ZIP, Package Manifest and detached signature.
2. Verify ZIP size and SHA-256, JCS manifest validity, Ed25519 signature and publisher trust.
3. Extract to a versioned user-owned release directory.
4. Prepare user-level launcher and desktop entry.
5. Preserve node data and configuration.
6. Launch CIN Main Lobby and record installation metadata.

## Functional boundaries

- Package installation is not node birth.
- The installer does not issue certificates or personal documents.
- The installer does not create or store private signing keys.
- No system-wide service, global package database or mandatory sudo step is part of this installer.
- Existing Package Manifest v1 is ZIP-specific. A new archive format requires a versioned specification.

## Initial implementation order

Bootstrap and CLI → release verifier → extraction and version directory → XDG user integration → launch handoff to Main Lobby.
