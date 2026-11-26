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


## Debian 13 ARM64 user-space delivery for LinDesk

The AppImage remains the mainstream Linux desktop distribution. The LinDesk-specific delivery is a separate native Debian ARM64 payload:

- Produce CIN.deb with Architecture: arm64 on a Debian 13 ARM64 runner.
- Embed the relocatable CIN AppDir and all user-space install/uninstall/run scripts in the same .deb.
- Install by extracting the .deb with dpkg-deb -x and executing the embedded installer as the normal user.
- Never require sudo, root, apt install, dpkg -i, system package database registration, or system-wide writes.
- Install under ~/.local/opt/cin-main-lobby/AppDir; create the launcher under ~/.local/bin and desktop integration under XDG user paths.
- Preserve user data, configuration, and cache during replacement and uninstall.
- Do not require systemd, a systemd user manager, cgroup visibility, FUSE, or an always-running service.
- Validate package metadata, AArch64 ELF dependencies, no-root install, root refusal, rollback, upgrade, uninstall/data preservation, and GTK launch in CI.
- Treat physical LinDesk device validation as a separate release gate. The reported environment is Debian 13, ARM64, glibc 2.43, GTK4 and PyGObject; the reported lack of a graphical session means the app can be installed headlessly but must be launched from a working graphical session.

Recommended user command sequence:

~~~sh
tmp="$(mktemp -d)"
dpkg-deb --extract ./CIN.deb "$tmp"
sh "$tmp/opt/cin-installer/install-user.sh" "$PWD/CIN.deb"
result=$?
rm -rf "$tmp"
exit "$result"
~~~

CIN-Debian13-Installer.zip remains an optional convenience bundle containing the same package and scripts.


## Deferred scope

Founding certificate processes, node creation, Enter, Import, external signing connectors, and the CIN Package Engine remain later milestones.
