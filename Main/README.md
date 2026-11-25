# CIN Main

**Mission:** build a Linux user-mode application that runs inside supported Linux distributions, including distributions provided by the Lindesk Android APK environment, reaches a functional Lobby, and installs dedicated engines from that Lobby.

## Binding product direction

1. Linux user mode only. CIN runs as an ordinary user-space process inside a Linux distribution. It does not require a custom kernel, kernel module, privileged daemon, or host operating-system replacement.
2. Lindesk-on-Android compatibility. CIN must run inside a Linux distribution provided by the Lindesk Android APK. The expected chain is Android -> Lindesk -> Linux distribution -> CIN Main -> Lobby.
3. Virtualization/isolation awareness. The exact mechanism Lindesk uses to provide Linux is not assumed. Main detects available user-space capabilities and does not presume a full virtual machine, root access, systemd, or direct Android APIs.
4. Additional Linux compatibility. Keep the runtime portable to conventional Linux desktop and virtualized Linux environments where practical, without compromising the required Lindesk execution path.
5. Lobby as the first complete user-facing destination. The user must be able to launch CIN, reach the Lobby, inspect available engine packages, and install/manage engines through the engine manager.
6. Engines are installable capabilities. The base runtime provides the lifecycle and integration contract; dedicated engines are separately packaged and installed components.
7. Clean foundation. Previous implementations, languages, dependencies, and architecture decisions are historical references only. Nothing is inherited by default.

## Runtime path

Android host -> Lindesk APK -> Linux distribution/environment -> CIN Linux user-mode runtime -> local services -> engine package manager -> Lobby.

## Scope boundary

The first milestone is a working Linux user-mode host in the Lindesk-provided Linux environment that reaches the Lobby and can install a first demonstrator engine. This is not an Android-native CIN APK and does not require CIN to control the host Android system.

## Design and implementation sequence

See ARCHITECTURE.md, RUNTIME.md, ENVIRONMENT.md, ENGINE_SYSTEM.md, LOBBY.md, and ROADMAP.md. The implementation language and concrete Lindesk integration details remain open until the environment is inspected; no previous stack is presumed.
