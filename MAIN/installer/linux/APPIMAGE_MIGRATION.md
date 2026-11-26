# CIN Linux distribution — ARM64 AppImage and Debian package

## Release scope

The current Linux release targets ARM64 / AArch64 only. Supported execution environments are ARM64 Linux hardware and ARM64 virtual machines whose guest exposes an ARM64 Linux userspace and compatible kernel. Virtualization is optional. x86_64 is not part of this release.

Two distribution artifacts are produced:

- Core_Identification_Nodes-aarch64.AppImage — recommended graphical per-user installation, without root or sudo.
- Core_Identification_Nodes-arm64.deb — conventional Debian/Ubuntu ARM64 package.

## AppImage first-run experience

1. The user downloads the AArch64 AppImage.
2. If necessary, the user enables executable permission in the file manager.
3. A double-click opens the CIN graphical welcome installer.
4. “Install for this user” copies the AppImage to ~/Applications, creates a desktop launcher under ~/.local/share/applications, and creates a user uninstaller at ~/.local/bin/cin-uninstall.
5. CIN starts in Main Lobby. “Run without installing” is also available.

The AppImage user flow does not use root, sudo, administrator authentication, apt, dpkg, or system directories. Some file managers require the user to enable executable permission before launching a downloaded AppImage.

## Debian package privilege model

The .deb installs the AppImage payload under /opt/cin and a desktop entry under /usr/share/applications. A conventional Debian package installation writes to system locations and therefore requires administrator authorization through the graphical package manager, apt, or dpkg. After installation, CIN itself runs as the logged-in user.

A standard .deb cannot perform a system package installation without administrator authorization. Users requiring a strictly rootless installation must choose the AppImage.

## Runtime compatibility

The release is for mainstream glibc-based ARM64 desktop Linux distributions. Alpine/musl, x86_64, non-desktop systems, and unsupported CPU architectures are outside the initial target. ARM64 virtual machines are supported when the guest kernel/userspace and graphics stack meet the same requirements as native ARM64 Linux.

The GTK4/PyGObject runtime, introspection typelibs, and dynamically loaded libraries must be included and verified in the AppImage. A successful file build alone is not proof of portability.

## CIN runtime components

The distribution includes Main Lobby, Settings, Deploy engine, and the CIN network controller. The Deploy engine is included, but component-level updates remain disabled until an AppImage-aware signed replacement updater, genuine publisher public key, and signed official manifest are provisioned and verified.

The network switch may only report OFF when CIN's own process scope is actually denied network access. If the host lacks a usable systemd user manager or required cgroup support, the UI must report the control as unavailable.

## Release gates

- Build only for AArch64 on an ARM64 runner.
- Inspect the AppImage payload and confirm the Main Lobby and installer entry points, GTK typelibs, Deploy engine, and network controller are present.
- Smoke-test the AppImage on ARM64 Linux.
- Build the .deb and verify its package metadata reports Architecture: arm64.
- Test AppImage first-run installation, Main Lobby launch, Settings navigation, uninstall, and preservation of user data.
- Verify network policy only on supported systemd environments.
- Do not publish until GTK4 typelibs and native dependencies work without requiring host-installed Python, PyGObject, or GTK.
