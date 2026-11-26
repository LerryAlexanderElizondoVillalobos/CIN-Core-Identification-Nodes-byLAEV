# CIN Debian 13 — User Space Edition

**Target OS:** Debian GNU/Linux 13 (Trixie), ARM64/AArch64  
**Package:** `CIN.deb` (native Debian package payload)  
**Distribution bundle:** `CIN-Debian13-Installer.zip`  
**Installation scope:** current user only; no sudo, root, apt install, dpkg -i, or system package database changes.

## What is delivered

The native ARM64 `CIN.deb` contains both the relocatable CIN AppDir and its user-space installer/uninstaller under `/opt/cin-installer/`. The ZIP is an optional convenience bundle containing the same .deb and helper scripts.

The package is deliberately not installed with `dpkg -i`. A conventional system-wide .deb installation requires administrator authorization. Here the .deb is an immutable, versioned application payload; the operator extracts it with `dpkg-deb -x` and runs its embedded installer from the temporary extraction.

## Requirements

- Debian 13 (Trixie) ARM64/AArch64.
- Ordinary non-root desktop user.
- `dpkg-deb` (provided by Debian's dpkg package).
- A graphical desktop session supported by GTK 4.
- No FUSE, VM, Docker, systemd service, or root access is required.

The application runtime and GTK/PyGObject components are packaged in the relocatable AppDir. Core operating-system interfaces and graphics/display services remain supplied by Debian.

## Install

### Single-file `.deb` installation (recommended)

Run these commands as the normal user from the directory containing `CIN.deb`:

```sh
tmp="$(mktemp -d)"
dpkg-deb --extract ./CIN.deb "$tmp"
sh "$tmp/opt/cin-installer/install-user.sh" "$PWD/CIN.deb"
result=$?
rm -rf "$tmp"
exit "$result"
```

The `.deb` is ARM64-native, but it is not registered in the system package database. Its embedded installer places the application only in the current user's home directory.

### ZIP convenience installation

Alternatively, extract `CIN-Debian13-Installer.zip`, open a terminal in that directory, and run `./install-user.sh`.

Launch **Core Identification Nodes** from the desktop menu, or run `~/.local/bin/cin`.

Do not run the installer with sudo. It intentionally refuses root execution.

## Run without installing

After extracting the ZIP, run `./run-user.sh` to extract the package into a temporary cache directory, launch CIN, and remove that temporary extraction when CIN exits. This does not create a persistent installation. The installed launcher is `~/.local/bin/cin`.

## Uninstall

Run `./uninstall-user.sh` from the extracted ZIP, or run `~/.local/bin/cin-uninstall`.

The uninstaller removes only the CIN application payload, launcher, desktop entry and icon. It preserves:
- `~/.local/share/cin` (user data)
- `~/.config/cin` (configuration)
- `~/.cache/cin` (cache)

## Installation locations

| Purpose | Location |
|---|---|
| Application | `~/.local/opt/cin-main-lobby/AppDir` |
| Command launcher | `~/.local/bin/cin` |
| Uninstaller | `~/.local/bin/cin-uninstall` |
| Desktop entry | `~/.local/share/applications/cin.desktop` |
| Icon | `~/.local/share/icons/hicolor/256x256/apps/cin.png` |
| User data | `~/.local/share/cin` |
| Configuration | `~/.config/cin` |
| Cache | `~/.cache/cin` |

## Memory and background activity

This edition does not install or enable a background daemon, auto-start service, VM, container, or resident update agent. CIN starts only when the user launches it and exits when the application is closed. It does not create an additional application process for the installer after installation.

Memory use is workload- and desktop-dependent. CI records process RSS during smoke testing; no fixed RAM minimum or "zero memory" claim is made. The GTK4 Main Lobby remains a graphical application and necessarily consumes memory while open.

## Package architecture

The .deb has `Architecture: arm64` because its packaged native application payload is built for AArch64. It is not an `Architecture: all` package. Debian 13 ARM64 is the release target for this artifact.

## Validation boundary

The automated workflow validates Debian 13 package metadata, archive contents, unprivileged installation and removal, and a GUI smoke test. Physical-device testing is still required for individual hardware and desktop environments. A CI pass does not certify every Debian derivative or non-ARM64 system.
