# Main Roadmap — Linux User Mode to Lobby

## M0 — Runnable Linux user-mode host

Deliver a launcher and host process that run as a standard user, establish user-owned paths, report environment details, and shut down cleanly.

Exit condition: launch and diagnostics work on the selected Linux test environment without sudo.

## M1 — Linux desktop and VM compatibility baseline

Implement the platform probe and capability-based compatibility layer. Validate native Linux desktop and Linux guest VM execution. Keep desktop-specific integration replaceable.

Exit condition: the same host build runs in both selected environments and reports capabilities accurately.

## M2 — Local service host

Start the minimum local services and expose a stable local API for Lobby and engine manager. Add process supervision and runtime status reporting.

Exit condition: Lobby client can connect to the host and retrieve runtime status.

## M3 — Engine package lifecycle

Define the first package manifest and package format. Implement catalog discovery, staging, validation, installation, registration, activation, status, update, and removal in user-owned storage.

Exit condition: a demonstrator engine completes the lifecycle end to end.

## M4 — Lobby

Deliver the Lobby interface for runtime status, catalog, engine details, installation, installed-engine management, and diagnostics.

Exit condition: a user completes the demonstrator engine lifecycle entirely through the Lobby.

## M5 — Consolidation

Test startup, shutdown, restart, interrupted installation recovery, user path handling, and operation inside the selected Linux VM and desktop environments. Add further hardening only against risks demonstrated by the implementation and tests.

## Work order

Do not start by building a large engine suite or a broad network architecture. Complete the vertical slice in order: user-mode host -> Linux/VM compatibility -> local API -> engine manager -> Lobby -> first engine.

## Open decisions

- Exact meaning and target specification of Linux Lindesk.
- First Linux distribution and CPU architecture for the reference build.
- First virtualization platform used for validation.
- Implementation language and UI framework.
- Local host-to-Lobby communication protocol.
- Engine package/archive format and catalog source.
