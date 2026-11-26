# CIN Linux distribution — ARM64 only

## Official formats

This release targets **Linux ARM64 / AArch64 only** and produces two distribution files:

- `Core_Identification_Nodes-aarch64.AppImage` — recommended user-space installer.
- `Core_Identification_Nodes-arm64.deb` — conventional Debian package for Debian/Ubuntu ARM64.

The AppImage is portable and installs into the current user's home directory without root or sudo. The .deb is a standard system package and requires administrator authorization through the package manager. These are intentionally different installation models.

## Execution environments

CIN does not require virtualization. It runs on compatible Linux ARM64 systems on physical ARM64 hardware or in an ARM64 virtual machine. A VM must expose an ARM64 userspace and compatible Linux kernel. x86_64 systems and emulation are not supported targets for this release.

## AppImage first-run experience

1. Download the ARM64 AppImage.
2. If necessary, enable execution in Properties → Permissions.
3. Double-click the AppImage.
4. Select **Install for this user** or **Run without installing**.
5. The installer copies the AppImage to `~/Applications`, creates a desktop entry and icon under `~/.local/share`, and opens Main Lobby.

The user-facing AppImage flow does not invoke a terminal, root, sudo, apt, dpkg, or administrator authentication. It does not write to system directories.

## Debian package

The .deb contains the ARM64 AppImage payload under `/opt/cin` and adds a system-wide desktop launcher. Installing or removing it through apt, dpkg, GDebi, Discover, or another package manager requires administrator authorization. The running CIN application itself runs as the logged-in user.

## Runtime compatibility

The AppImage targets mainstream glibc-based Linux ARM64 desktop distributions. Alpine/musl, x86_64, very old glibc systems, and non-desktop environments are outside the initial target. A successful build is not proof of portability: GTK4/PyGObject typelibs, dynamically loaded libraries, and the GUI must be tested in clean environments.

## Included CIN components

The distribution includes Main Lobby, Settings, Deploy engine, and the CIN network controller. Remote component updates remain disabled until an AppImage-aware signed replacement updater, genuine publisher Ed25519 public key, and signed official manifest are provisioned and verified.

The network switch may report OFF only when CIN's own process scope is actually denied network access. If the host lacks a usable systemd user manager or required cgroup support, the UI must report the control as unavailable.

## Release gates

- Build only on ARM64/AArch64.
- Inspect AppImage payload and Debian control metadata; confirm `Architecture: arm64`.
- Run source tests and Python/shell syntax checks.
- Validate GTK4/PyGObject runtime and GUI startup in a clean ARM64 environment.
- Verify AppImage double-click, per-user installation, Main Lobby launch, Settings navigation, and uninstall without root.
- Verify Debian installation and removal using an authorized test environment.
- Test physical ARM64 hardware and ARM64 virtual machines where available.
- Verify network policy only on hosts that support the required user scope.
