# Main Architecture

## 1. Product objective

Main is the Linux user-mode host for CIN. Its first complete vertical slice must start as an ordinary user process, adapt to the Linux execution environment, start the local services required by the application, open the Lobby, and install/manage a separately packaged engine.

## 2. Execution model

- User-space process: no kernel replacement, custom kernel module, privileged service, or mandatory root execution.
- User-owned state: configuration, logs, cache, installed engines, and runtime data live under user-writable locations selected by the runtime.
- Explicit host boundary: the runtime detects capabilities available to the process and uses documented user-space interfaces.
- Virtualization-neutral core: the application must not depend on a single hypervisor API to function inside a Linux guest.
- Desktop integration is an adapter, not the core runtime. Headless startup and diagnostics remain possible.

## 3. Runtime layers

1. Launcher: starts the application process and forwards arguments/environment.
2. Platform probe: reports kernel, architecture, libc/runtime facts, user permissions, display/session availability, and virtualization hints when discoverable.
3. Compatibility layer: normalizes paths, process lifecycle, IPC, networking, desktop launch, and user-session integration.
4. Local service host: starts and supervises the minimum local services needed by Lobby and engine management.
5. Engine manager: discovers, validates, installs, activates, stops, updates, and removes engine packages.
6. Lobby: the first user-facing control surface for runtime status and engine lifecycle.

## 4. Dependency direction

Launcher -> platform probe -> compatibility layer -> local service host -> engine manager -> Lobby.

Engines depend on published host contracts. The host must not depend on a particular engine to boot or display the Lobby.

## 5. Initial vertical slice

A. Launch from a normal Linux user session.
B. Detect and report the execution environment.
C. Start the local host services without elevated privileges.
D. Open a usable Lobby.
E. Show a local engine catalog or package source.
F. Install, activate, inspect, stop, and uninstall a small demonstrator engine.

## 6. Deliberately undecided

The implementation language, UI framework, package archive format, IPC protocol, exact Lindesk API, supported hypervisors, CPU architecture matrix, and remote catalog protocol are not fixed by this document. They must be selected based on the first runnable vertical slice, not inherited from historical work.

## 7. Out of scope for the first slice

- Requiring root or host administrator privileges.
- Kernel modules or a custom operating system.
- A complete peer-to-peer network.
- Production certificate authority or key custody infrastructure.
- Implementing every planned engine before the engine installation lifecycle works.
