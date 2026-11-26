# Core Identification Nodes — Linux ARM64

**Architecture:** ARM64 / AArch64 only  
**Recommended format:** AppImage — graphical, per-user, no root or sudo  
**Additional format:** Debian ARM64 package (.deb)

## Supported execution environments

CIN runs on compatible Linux ARM64 systems on physical hardware or inside an ARM64 virtual machine. Virtualization is not required. A virtual machine must expose ARM64 userspace and a compatible Linux kernel. x86_64 and emulated environments are outside this release target.

## AppImage — user-mode installation

1. Download `Core_Identification_Nodes-aarch64.AppImage`.
2. Enable execution in file Properties → Permissions if required by the desktop.
3. Double-click the file.
4. Select **Install for this user** or **Run without installing**.

The installer places the AppImage in `~/Applications`, creates a launcher under `~/.local/share/applications`, and opens CIN Main Lobby. This flow does not require root, sudo, a password, or terminal use. Uninstall with `~/.local/bin/cin-uninstall`; user data is preserved.

## Debian ARM64 package

Download `Core_Identification_Nodes-arm64.deb` on Debian/Ubuntu ARM64. The package installs the AppImage payload under `/opt/cin` and creates a system-wide application launcher.

**Privilege distinction:** installing a conventional .deb through apt, dpkg, GDebi, Discover, or another package manager requires administrator authorization. The installed application runs as the logged-in user. If administrator authentication is unavailable or prohibited, use the AppImage.

## Included components and current limitations

The distribution includes Main Lobby, Settings, Deploy engine, and the CIN network controller. Remote component updates remain disabled until an AppImage-aware signed replacement updater, the genuine publisher public key, and a signed official manifest are provisioned and verified.

The network switch is application-scoped. It may report OFF only when the Linux host actually enforces CIN's process-scope policy. If systemd user-manager or cgroup support is unavailable, the control must be reported as unavailable.

## Release validation

Do not treat a build as a release until ARM64 source tests, payload inspection, GTK4/PyGObject runtime checks, AppImage graphical installation, Main Lobby navigation, .deb metadata validation, and installation tests have passed.
