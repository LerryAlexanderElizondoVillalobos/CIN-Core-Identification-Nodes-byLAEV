# Linux User-Mode Runtime

## Purpose

Define how CIN starts and operates as a normal Linux user process. The runtime must not require root for ordinary launch, Lobby access, or installation of engines into user-owned application storage.

## Responsibilities

- Resolve its own executable and resource locations.
- Establish user-writable configuration, state, cache, log, and engine directories.
- Detect the current Linux environment and report capabilities instead of assuming them.
- Start, monitor, and stop local child processes/services owned by the current user.
- Expose a stable local API to the Lobby and installed engines.
- Shut down cleanly and preserve user data according to explicit lifecycle rules.

## User data layout

The concrete paths must follow Linux user directory conventions and remain configurable. The runtime should distinguish:

- Configuration: user preferences and runtime settings.
- State: installed-engine registry and persistent operational state.
- Data: engine-owned durable data.
- Cache: disposable downloaded or generated artifacts.
- Logs: diagnostic records suitable for user inspection.

No system-wide installation path is required for the first milestone.

## Process lifecycle

The launcher starts the host. The host performs environment discovery, initializes user-space storage, starts required local services, initializes the engine manager, and then exposes the Lobby. Shutdown reverses the sequence and stops only processes owned by this CIN runtime instance.

## Runtime acceptance criteria

- Starts from a standard Linux user account without sudo.
- Works with paths containing spaces and non-ASCII characters.
- Can run without a graphical session for diagnostics, while reporting that the Lobby UI is unavailable.
- Does not assume systemd is present or available to the user.
- Does not require writes outside user-owned locations for normal operation.
- Reports missing optional desktop capabilities without failing the core runtime.
