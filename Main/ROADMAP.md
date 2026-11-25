# Main Roadmap — Lindesk Linux User Mode to Lobby

## M0 — Reference environment inspection

Identify the Lindesk APK version, Linux distributions it provides, Linux launch mechanism, persistence model, display path, networking, process behavior, and available user-space capabilities. Select one distribution as the first reference target.

Exit condition: a reproducible environment profile exists, based on observed behavior rather than assumptions.

## M1 — Runnable Linux user-mode host

Deliver a launcher and host process that run as a standard user inside the selected Lindesk-provided Linux distribution, establish user-owned paths, report environment details, and shut down cleanly.

Exit condition: launch and diagnostics work without sudo or privileged Android/host access.

## M2 — Compatibility and local service host

Implement the platform probe and capability-based compatibility layer. Start the minimum local services and expose a stable local API for Lobby and engine manager. Validate process, filesystem, network, and graphical-session behavior in the reference environment.

Exit condition: Lobby client can connect to the host and retrieve runtime status inside Lindesk's Linux environment.

## M3 — Engine package lifecycle

Define the first package manifest and package format. Implement catalog discovery, staging, validation, installation, registration, activation, status, update, and removal in persistent user-owned storage.

Exit condition: a demonstrator engine completes the lifecycle end to end without root.

## M4 — Lobby

Deliver the Lobby interface for runtime status, environment capabilities, catalog, engine details, installation, installed-engine management, and diagnostics.

Exit condition: a user completes the demonstrator engine lifecycle entirely through the Lobby in the selected Lindesk Linux distribution.

## M5 — Portability validation

Validate additional Linux distributions exposed by Lindesk, then conventional Linux desktop and VM environments where practical. Confirm that optional environment-specific adapters do not leak into the Linux core.

Exit condition: compatibility claims are backed by tested environment profiles.

## Work order

Inspect Lindesk -> select reference Linux distribution -> build user-mode host -> establish local API -> implement engine manager -> deliver Lobby -> install first engine.

Do not build a large engine suite or assume a particular hypervisor/container technology before the reference environment has been inspected.

## Open decisions

- Exact Lindesk APK version and supported distributions.
- How Lindesk provides Linux (mechanism to be verified).
- First reference distribution and CPU architecture.
- Display/GUI forwarding mechanism.
- Filesystem persistence and Android shared-storage behavior.
- First validation device and environment constraints.
- Implementation language and UI framework.
- Local host-to-Lobby communication protocol.
- Engine package/archive format and catalog source.
