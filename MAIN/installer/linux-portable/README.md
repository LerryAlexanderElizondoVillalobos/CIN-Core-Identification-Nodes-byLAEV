# CIN Linux ARM64 Portable — LinDesk-compatible edition

**Target:** Linux ARM64 / AArch64 with glibc (Debian ARM64 userspace)
**Primary environment:** LinDesk on Android (Debian-based ARM64 userspace)
**Install model:** extracted AppDir, per-user; no sudo, root, FUSE, or system package manager
**Virtualization:** not required; also intended for compatible ARM64 Linux virtual machines

## Why this package exists

The standard AppImage is convenient on desktop Linux, but AppImage execution may depend on FUSE or extraction behavior that is not consistently available inside Android-hosted Linux environments. This edition packages the already-built CIN AppDir as a regular compressed archive. It runs the AppRun launcher directly from the extracted directory and does not mount an AppImage.

## LinDesk compatibility profile

LinDesk is described by its publisher as a Debian-based Linux environment running locally on Android without root, requiring Android 11 or later; Android 12 and later may require the in-app child-process configuration. CIN targets the ARM64 Debian userspace that LinDesk provides.

Expected conditions:
- ARM64/AArch64 userspace and kernel.
- Debian/glibc environment compatible with the libraries bundled in the CIN AppDir.
- LinDesk desktop session exposes a working graphical display to Linux applications (Wayland or X11) and a D-Bus session for full GTK integration.
- Android allows LinDesk child processes to continue running in the background.
- User has write access to their own home directory.

LinDesk's public product description does not publish a fixed RAM or storage minimum. CIN's package therefore avoids shipping a virtual machine or Linux distribution and reuses the host Debian userspace. The GTK runtime is bundled to reduce dependency installation.

## Install

1. Download and extract `CIN-Linux-ARM64-Portable.tar.gz`.
2. Open the extracted folder in LinDesk's Debian file manager or terminal.
3. Run `./install.sh` as the ordinary Linux user. Do not use sudo.
4. Launch **Core Identification Nodes** from the user's application menu, or run `~/.local/bin/cin`.

The installer copies the AppDir into `~/.local/share/cin/app`, creates a launcher and icon under `~/.local/share`, and creates a user command at `~/.local/bin/cin`. It does not write to `/opt`, `/usr`, `/etc`, or other system directories.

If the LinDesk desktop menu does not refresh automatically, use `~/.local/bin/cin` or log out and back into the Linux desktop session.

## Run without installing

From the extracted folder, execute `./run-cin.sh`. This runs CIN directly from the extracted AppDir and leaves no installed launcher.

## Uninstall

Run `~/.local/bin/cin-uninstall`. This removes only CIN application files and launchers from the current user's home directory. It preserves the user's CIN data and configuration.

## Virtualization

No VM, emulator, Docker, or systemd service is required. On a physical Linux ARM64 host, run the package directly. In an ARM64 virtual machine, run it inside the guest. In LinDesk, it runs as a normal unprivileged Linux process inside LinDesk's Debian userspace (which is not a separate hardware-virtualized guest).

## Runtime and resource profile

- Native ARM64 executable payload; no bundled guest OS.
- GTK4 Main Lobby and Settings UI, using the included GTK runtime.
- No FUSE mount.
- No privileged installer.
- No background daemon or auto-start service.
- Local user data remains under `$XDG_DATA_HOME/cin` or `~/.local/share/cin`.
- The actual RAM footprint depends on the GTK session and the host's display stack; measure it on the target LinDesk device before publishing a numeric minimum.

## Compatibility validation status

CI can validate ARM64 build output, archive structure, shell syntax, source tests, and a Linux GUI smoke test. It cannot certify LinDesk on every Android device. A final LinDesk acceptance pass must be run on a real Android 11+ ARM64 device with LinDesk installed, including a separate Android 12+ child-process configuration check.

## Current functional scope

This distribution packages the existing CIN Main Lobby, Settings, and Deploy components from the repository. It does not add new CIN business-domain capabilities. Remote component updates remain subject to the existing signed-update prerequisites documented in `MAIN/installer/linux/APPIMAGE_MIGRATION.md`.
