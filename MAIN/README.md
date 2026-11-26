# Core Identification Nodes — Linux ARM64

**Release target:** Linux ARM64 / AArch64 only  
**Recommended user-mode installer:** AppImage  
**Additional package:** Debian .deb for Debian/Ubuntu ARM64

CIN supports ARM64 hardware and ARM64 virtual machines. Virtualization is optional; the guest must expose an ARM64 Linux userspace and compatible kernel. x86_64 is not a target of this release.

## Downloads

- Core_Identification_Nodes-aarch64.AppImage — portable graphical installer; per-user installation without root or sudo.
- Core_Identification_Nodes-arm64.deb — conventional Debian package for ARM64.

## AppImage installation (no root)

1. Download the AArch64 AppImage.
2. If needed, enable execution in file Properties → Permissions.
3. Double-click the file.
4. Select **Install for this user** or **Run without installing**.
5. CIN installs under ~/Applications and creates a launcher in ~/.local/share/applications. Main Lobby opens after installation.

Uninstall with ~/.local/bin/cin-uninstall. User data and configuration are preserved.

## Debian package privilege requirement

A conventional .deb installation via a graphical package manager, apt, or dpkg requires administrator authorization to write to /opt and system application directories. The CIN application runs as the logged-in user after installation. If the machine must remain entirely rootless, use the AppImage; a standard Debian package cannot perform system-wide package installation without administrator privileges.

## Included capabilities

- Main Lobby as the initial screen.
- Settings with navigation back to Lobby.
- Deploy engine included; remote component updates remain disabled until an AppImage-aware signed replacement updater, genuine publisher Ed25519 public key, and signed official manifest are provisioned and verified.
- CIN-only network controller, enforced only where the user's systemd user scope and cgroup policy are supported.
- Graphical first-run installer and portable run option for AppImage.

## Release validation

The release is not complete until ARM64 source tests, AppImage payload inspection, clean-environment GTK4/PyGObject runtime tests, GUI installation, Lobby navigation, and uninstall validation pass. The .deb must report Architecture: arm64 and pass dpkg-deb metadata and payload checks.
