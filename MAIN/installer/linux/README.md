# Core Identification Nodes — Linux ARM64 packages

**Release architecture:** ARM64 / AArch64 only  
**Portable installer:** AppImage, graphical and per-user  
**Debian package:** .deb, for Debian/Ubuntu ARM64 systems

## Supported execution environments

CIN targets Linux ARM64 systems, whether installed directly on ARM64 hardware or inside an ARM64 virtual machine. The guest operating system must expose an ARM64 userspace and a compatible Linux kernel. Virtualization itself is not a requirement. An x86_64 guest or host is not a supported target for this release.

The AppImage is the recommended distribution for user-mode installation. It installs under ~/Applications, creates a launcher under ~/.local/share/applications, and does not require root, sudo, apt, dpkg, or administrator authentication. If the downloaded file is not marked executable, enable execution in the file manager's Properties → Permissions panel.

## AppImage installation

1. Download Core_Identification_Nodes-aarch64.AppImage.
2. Mark the file executable if the desktop environment has not done so.
3. Double-click it.
4. Select **Install for this user** or **Run without installing**.
5. The installed launcher opens CIN Main Lobby.

Uninstall the per-user copy with ~/.local/bin/cin-uninstall. CIN user data and configuration are preserved.

## Debian package

Download Core_Identification_Nodes-arm64.deb only on Debian/Ubuntu ARM64. It installs the AppImage payload under /opt/cin and adds a system desktop entry.

**Important privilege distinction:** a conventional Debian package installation through apt, dpkg, or a graphical package manager requires administrator authorization because it writes to system locations. The installed CIN application itself runs as the logged-in user and does not require root. If absolutely no administrator authentication is available, use the AppImage instead; a normal .deb cannot provide a true system package installation without those privileges.

## Included application

The distribution includes Main Lobby, Settings, the Deploy engine, and the CIN network controller. The Deploy engine is included, but remote component updates are disabled in this AppImage build. Enabling them requires an AppImage-aware signed replacement updater as well as the genuine publisher public key and signed official manifest.

## Network switch

The network switch is application-scoped. It may report OFF only when the current Linux system actually enforces the CIN scope policy. Systems without the required systemd user manager/cgroup support must show the control as unavailable; CIN must not imply that host-wide network access was disabled.

## Release validation

A generated file is not considered a release until the ARM64 build passes source tests, payload inspection, GTK4/PyGObject runtime tests, graphical first-run installation, Main Lobby navigation, and uninstall validation. The Debian package must also report Architecture: arm64 and pass dpkg-deb metadata and contents checks.
