# CIN Debian 13 ARM64 — Acceptance Test Plan

## Build environment
- Debian GNU/Linux 13 (Trixie).
- ARM64/AArch64 host and dpkg architecture `arm64`.
- Build the AppDir with the active Linux build script.
- Generate `dist/CIN.deb`, `dist/CIN-Debian13-Installer.zip` and `dist/SHA256SUMS`.

## Package inspection
- Package name is `core-identification-nodes`.
- Version is the declared release version.
- Architecture is `arm64`.
- AppDir includes executable `AppRun` and `usr/bin/cin-main`.
- ZIP includes the .deb, installer, uninstaller, no-install runner and README.
- ZIP passes `unzip -t` without archive errors.
- SHA-256 manifest validates.

## User-space installation
Run as a non-root test user on Debian 13 ARM64:
- Installer succeeds without sudo or root.
- Installer rejects root execution.
- Failed upgrade restores the previous application directory.
- Re-running the installer updates application files without deleting user data.
- App files are installed under `~/.local/opt/cin-main-lobby/AppDir`.
- Launcher is created at `~/.local/bin/cin`.
- Uninstaller is created at `~/.local/bin/cin-uninstall`.
- Desktop entry and icon are installed under XDG user paths.
- No writes occur under `/opt`, `/usr`, `/etc`, or the dpkg database.
- No apt install, dpkg -i, sudo, or system service installation occurs.

## Runtime and memory
- Launch CIN through the per-user command.
- Run CIN through `run-user.sh` without creating a persistent installation.
- Verify Main Lobby opens and Settings navigation works.
- Verify process exits after the application is closed.
- Confirm no CIN daemon, auto-start service or background update process remains.
- Capture peak RSS in CI and on a representative physical Debian 13 ARM64 device.
- Do not publish a fixed RAM requirement until measurements exist on target hardware.

## Uninstallation and data preservation
- Uninstall using the script from the ZIP.
- Repeat using `~/.local/bin/cin-uninstall`.
- Confirm application files, launcher, desktop entry and icon are removed.
- Confirm `~/.local/share/cin`, `~/.config/cin`, and `~/.cache/cin` remain untouched.

## Release boundary
CI validation is not physical-hardware certification. The first release target is Debian 13 ARM64. Debian derivatives, other Debian releases and other CPU architectures require separate validation.
