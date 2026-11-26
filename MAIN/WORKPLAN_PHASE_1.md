# Phase 1 Workplan — CIN Linux AppImage Distribution

## Objective

Deliver one graphical, self-contained Linux application per supported CPU architecture. The user downloads one AppImage, double-clicks it, and chooses to install CIN for the current user or run it portably. No root, sudo, administrator password, terminal, dpkg, apt, or system-wide writes are part of the user installation flow.

## Distribution targets

- `Core_Identification_Nodes-x86_64.AppImage`
- `Core_Identification_Nodes-aarch64.AppImage`

AppImage targets mainstream glibc-based Linux desktop distributions. It cannot guarantee compatibility with literally every Linux distribution, CPU architecture, musl environment, or headless system.

## User experience

- First launch opens a graphical welcome installer.
- Install copies the AppImage to `~/Applications`.
- A desktop entry is created in `~/.local/share/applications`.
- A per-user uninstaller is created in `~/.local/bin/cin-uninstall`.
- CIN launches Main Lobby.
- The user may instead choose Run without installing.
- Persistent data and publisher trust material remain separate from replaceable application files.

A Linux file manager may require the user to enable executable permission once before double-click execution. CIN does not bypass desktop security policy.

## Included functionality

### Main Lobby and Settings
- Main Lobby is the initial application screen.
- Settings opens from the Lobby and returns to it.
- Create remains explicit about workflows not yet implemented.
- Enter and Import remain unavailable until implemented.

### Deploy
- The application distribution includes the component-aware Deploy engine.
- Local manifests use SHA-256 component hashes.
- Official manifests require detached Ed25519 verification against an independently provisioned publisher key.
- Component changes require explicit operator authorization.
- Remote deployment is not live until the genuine publisher key and signed official manifest are provisioned.

### Network control
- The network switch is limited to CIN's own process scope.
- OFF must be confirmed by the actual Linux system policy.
- ON restores CIN's network access.
- If systemd user manager or cgroup support is unavailable, the UI must report the control as unavailable.
- No host-wide firewall or NetworkManager changes are permitted.

## Build and qualification

- Build separate x86_64 and AArch64 AppImages.
- Bundle the Python application runtime, GTK4/PyGObject dependencies, dynamically loaded libraries, and required introspection typelibs.
- Run source tests and syntax checks.
- Inspect AppImage payloads.
- Run clean desktop qualification on Ubuntu, Debian, Fedora, and Linux Mint where matching architecture runners are available.
- Verify graphical first-run installation, Main Lobby launch, Settings navigation, network behavior, uninstallation, and preservation of user data.
- Do not publish an artifact merely because packaging completed; portability and runtime qualification are release gates.

## Deferred scope

Founding certificate processes, node creation, Enter, Import, external signing connectors, and the CIN Package Engine remain later milestones.
