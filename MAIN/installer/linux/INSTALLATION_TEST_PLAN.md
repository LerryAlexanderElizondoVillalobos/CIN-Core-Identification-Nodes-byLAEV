# CIN Linux ARM64 — Acceptance Test Plan

## Release artifacts

- `Core_Identification_Nodes-aarch64.AppImage`
- `Core_Identification_Nodes-arm64.deb`

Both files must be built for ARM64/AArch64. No x86_64 artifact is part of this release.

## 1. AppImage payload

Verify the AppImage contains:
- AppRun entry point
- CIN Main Lobby executable
- graphical first-run installer
- GTK4/PyGObject runtime dependencies and introspection typelibs
- Deploy engine and network controller modules
- desktop integration metadata and icon

## 2. AppImage user-mode installation

On a clean ARM64 Linux desktop:
- Download the AppImage and enable executable permission if required.
- Double-click it and confirm the graphical installer appears.
- Select **Install for this user**.
- Confirm installation under `~/Applications`.
- Confirm desktop entry and icon under `~/.local/share`.
- Confirm no root, sudo, administrator password, terminal, package manager, or system directory modification occurs.
- Confirm Main Lobby opens after installation.

Also test **Run without installing**.

## 3. Main Lobby

Open the installed launcher. Verify Main Lobby is the initial screen and Settings navigation works in both directions.

## 4. Debian ARM64 package

- Run `dpkg-deb --info` and confirm `Architecture: arm64`.
- Inspect contents and confirm the AppImage payload and desktop launcher are present.
- Install in a disposable Debian/Ubuntu ARM64 test environment with administrator authorization.
- Launch CIN as a normal logged-in user.
- Remove using the package manager and confirm package files are removed.

The conventional .deb package-manager installation requires administrator authorization. This is not the no-root installation route.

## 5. Deploy

Verify included Deploy components and current supported local functionality. Remote updates must remain disabled until the AppImage-aware signed replacement updater, genuine publisher public key, and signed official manifest are provisioned and verified.

## 6. Network control

On supported systemd environments:
- Verify only CIN's process scope is affected.
- Toggle OFF and verify CIN network traffic is denied.
- Verify a separate process retains network access.
- Toggle ON and verify CIN access returns.
- On unsupported systems, confirm the UI reports unavailable.

## 7. Environment coverage

Test:
- Physical Linux ARM64 hardware.
- Linux ARM64 virtual machine.
- At least one Debian/Ubuntu ARM64 desktop.
- Additional glibc-based ARM64 desktops where available.

Virtualization is optional; the guest must be ARM64. Record distribution release, kernel, glibc version, architecture, GUI result, and installation result.

## 8. Uninstall and data preservation

Run `~/.local/bin/cin-uninstall` for AppImage installations. Verify the per-user AppImage and launcher are removed while user data and publisher trust configuration are preserved.
