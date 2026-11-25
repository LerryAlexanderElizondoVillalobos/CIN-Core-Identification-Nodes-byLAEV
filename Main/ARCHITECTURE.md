# Main Architecture

## 1. Product objective

Main is the Linux user-mode host for CIN. Its required reference execution path is an Android device running the Lindesk APK, which provides a Linux distribution in which CIN runs as an ordinary user-space application. The first complete vertical slice must start in that Linux environment, initialize local services, open the Lobby, and install/manage a separately packaged engine.

## 2. Execution model

The reference layered environment is:

Android host -> Lindesk Android APK -> Linux distribution/environment -> CIN Main -> Lobby and installable engines.

- User-space process: no kernel replacement, custom kernel module, privileged daemon, or mandatory root execution.
- Linux boundary: CIN operates through Linux user-space interfaces exposed inside the selected distribution.
- No assumed hypervisor: do not presume Lindesk uses a full VM. Detect capabilities and verify its actual isolation mechanism.
- User-owned state: configuration, logs, cache, installed engines, and runtime data live under user-writable persistent locations selected by the runtime.
- Optional host integration: Android/Lindesk-specific features are adapters, never dependencies of the Linux core.
- Portable architecture: keep the host independent of a single Linux distribution, desktop shell, or virtualization mechanism.

## 3. Runtime layers

1. Launcher: starts the application process and forwards arguments/environment.
2. Platform probe: reports Linux kernel/userspace facts, architecture, permissions, filesystem, process, network, display, and discoverable isolation capabilities.
3. Compatibility layer: normalizes paths, process lifecycle, IPC, networking, graphical session integration, and optional Lindesk-specific adapters.
4. Local service host: starts and supervises the minimum local services needed by Lobby and engine management.
5. Engine manager: discovers, validates, installs, activates, stops, updates, and removes engine packages.
6. Lobby: the first user-facing control surface for runtime status and engine lifecycle.

## 4. Dependency direction

Launcher -> platform probe -> compatibility layer -> local service host -> engine manager -> Lobby.

Engines depend on published host contracts. The host must not depend on a particular engine to boot or display the Lobby.

## 5. Initial vertical slice

A. Launch from a Linux distribution provided by Lindesk on Android as a normal Linux user.
B. Detect and report the Linux environment and capabilities visible to CIN.
C. Establish persistent user-owned storage and start required local services without elevated host privileges.
D. Open a usable Lobby using the graphical mechanism exposed by the Linux environment.
E. Show a local engine catalog or package source.
F. Install, activate, inspect, stop, and uninstall a small demonstrator engine.

## 6. Deliberately undecided

The implementation language, UI framework, package archive format, IPC protocol, exact Lindesk internals, supported Linux distributions, Android shared-storage integration, and remote catalog protocol are not fixed by this document. Select them based on inspection and the first runnable vertical slice, not historical assumptions.

## 7. Out of scope for the first slice

- Requiring root or Android administrator privileges.
- Kernel modules or a custom operating system.
- Assuming Lindesk is a full virtual machine.
- Requiring direct Android APIs for core CIN operation.
- A complete peer-to-peer network or domain-specific engine suite.
