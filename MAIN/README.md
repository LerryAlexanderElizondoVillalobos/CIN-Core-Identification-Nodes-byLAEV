# Core Identification Nodes — Linux ARM64

**Release architecture:** ARM64 / AArch64 only  
**Supported execution:** ARM64 Linux on physical hardware or an ARM64 virtual machine  
**Primary format:** AppImage — graphical per-user installation, no root and no sudo  
**Additional format:** Debian ARM64 package (.deb)

## Distribution files

- `Core_Identification_Nodes-aarch64.AppImage` — recommended; user-space installation to `~/Applications`, no administrator access.
- `Core_Identification_Nodes-arm64.deb` — conventional Debian package for Debian/Ubuntu ARM64 systems. Installation through apt, dpkg, GDebi, Discover or another package manager requires administrator authorization.

The application itself does not require virtualization. It runs on compatible ARM64 Linux installations whether they are on physical ARM64 hardware or inside an ARM64 virtual machine. An x86_64 virtual machine or CPU-emulation layer is not an ARM64 target.

## AppImage installation (recommended)

1. Download `Core_Identification_Nodes-aarch64.AppImage`.
2. If the desktop environment requests it, enable execution in the file's Properties → Permissions.
3. Double-click the AppImage.
4. Choose **Install for this user** or **Run without installing**.

The graphical installer copies the AppImage to `~/Applications`, creates the desktop entry and icon in the user's home directory, and opens CIN Main Lobby. It does not invoke a terminal, root, sudo, apt, dpkg or administrator authentication. It does not write to system directories.

Uninstall the per-user launcher with `~/.local/bin/cin-uninstall`. User data and configuration are preserved.

## Debian package installation

Install `Core_Identification_Nodes-arm64.deb` using the distribution's graphical package installer or package manager. This is a conventional ARM64 Debian package and normally requires administrator authentication because it installs the application under `/opt` and registers a system-wide launcher.

After installation, launch **Core Identification Nodes** from the application menu. Remove it using the distribution's package manager.

## Included application

- CIN Main Lobby as the initial screen.
- Settings and navigation back to Main Lobby.
- Deploy engine included; component-level remote updates remain disabled until an AppImage-aware signed replacement updater, genuine publisher Ed25519 public key and signed official manifest are provisioned and verified.
- CIN-only network ON/OFF controller. Enforcement is available only when the user's systemd scope and cgroup policy support it. If unsupported, CIN must report the control as unavailable rather than claim isolation.

## Release acceptance requirements

A generated file is not an official release until it passes:
1. Source tests and Python/shell syntax checks.
2. ARM64/AArch64 architecture validation of both packages.
3. AppImage payload inspection and GTK4/PyGObject runtime validation.
4. Graphical AppImage installation without root or sudo.
5. Main Lobby launch and Settings navigation.
6. Debian package metadata and payload inspection.
7. ARM64 virtual-machine and physical-device smoke tests where hardware is available.
8. Supported network-scope OFF/ON tests and uninstall validation.

See [Linux AppImage migration](installer/linux/APPIMAGE_MIGRATION.md) and the [installation acceptance test plan](installer/linux/INSTALLATION_TEST_PLAN.md).


## Linux ARM64 Portable — LinDesk

A no-root, extracted-AppDir distribution is being prepared for Debian-based ARM64 Linux environments hosted on Android, including LinDesk. It does not require FUSE, a virtual machine, sudo, or system-wide package installation.

- [Portable distribution documentation](installer/linux-portable/README.md)
- [Installation acceptance test plan](installer/linux-portable/INSTALLATION_TEST_PLAN.md)
- [LinDesk ARM64 CI workflow](../.github/workflows/linux-arm64-portable-lindesk.yml)

The portable package reuses the existing GTK4 Main Lobby and Settings payload. LinDesk device compatibility and memory use still require testing on physical Android hardware.


## Debian 13 ARM64 — User Space Edition

A dedicated Debian 13 (Trixie) ARM64 distribution is being prepared as a native Debian package payload plus a ZIP installer:

- `CIN.deb` — native `arm64` package containing the relocatable CIN AppDir.
- `CIN-Debian13-Installer.zip` — includes `CIN.deb`, `install-user.sh`, `uninstall-user.sh`, and documentation.
- Installation uses `dpkg-deb -x` and places the application under `~/.local/opt/cin-main-lobby/`.
- No `sudo`, root, `dpkg -i`, `apt install`, system package database, daemon, or auto-start service is used.
- The uninstaller preserves user data, configuration and cache.

See [Debian 13 distribution and install instructions](installer/debian13/README.md).
