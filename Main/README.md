# CIN Main

**Mission:** build a Linux user-mode application that can run in a Linux desktop or virtualized Linux environment, reach a functional Lobby, and install dedicated engines from that Lobby.

## Binding product direction

1. Linux user mode only. CIN runs as an ordinary user-space process and does not require a custom kernel, kernel module, privileged daemon, or host operating-system replacement.
2. Linux desktop and virtualization compatibility. The runtime must work within supported Linux desktop environments and Linux guests hosted by virtualization platforms. The exact Lindesk integration and virtualization targets will be specified in the environment contract before implementation.
3. Lobby as the first complete user-facing destination. The initial product path ends when the user can launch CIN, reach the Lobby, inspect available engine packages, and install/manage engines through the engine manager.
4. Engines are installable capabilities. The base runtime provides the lifecycle and integration contract; dedicated engines are separately packaged and installed components.
5. Clean foundation. Previous implementations, languages, dependencies, and architecture decisions are historical references only. Nothing is inherited by default.

## Runtime path

Linux user process -> environment detection and compatibility layer -> local runtime services -> engine package manager -> Lobby.

## Scope boundary

The first milestone is not a complete global network, certificate ecosystem, or domain-specific engine suite. It is a working Linux user-mode host that reaches the Lobby and can install a first demonstrator engine through a defined package lifecycle.

## Design and implementation sequence

See ARCHITECTURE.md, RUNTIME.md, ENVIRONMENT.md, ENGINE_SYSTEM.md, LOBBY.md, and ROADMAP.md. The implementation language and concrete virtualization integrations remain open until selected deliberately; no previous stack is presumed.
