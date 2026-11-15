# CIN Data Root Resolver Specification v1

Status: Implemented baseline contract.

## Resolution order
1. Explicit application configuration.
2. Environment variable `CIN_DATA_DIR`.
3. Platform default: Windows `%APPDATA%/CIN`; macOS `~/Library/Application Support/CIN`; Linux/Unix `$XDG_DATA_HOME/CIN` or `~/.local/share/CIN`.

The resolver never uses executable/package directory as user data root. Caller creates root through storage service and presents selected path to the user.

## Acceptance
Explicit path wins; environment path is used without explicit config; platform fallback is deterministic; unresolved platform path errors; portable acceptance verifies data survives application relocation.
