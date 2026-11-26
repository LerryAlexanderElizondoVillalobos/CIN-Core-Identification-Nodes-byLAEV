# CIN Linux ARM64 — Acceptance Test Plan

## Release artifacts

- Core_Identification_Nodes-aarch64.AppImage
- Core_Identification_Nodes-arm64.deb

Both artifacts target ARM64 / AArch64 Linux only. Test on native ARM64 hardware and at least one ARM64 virtual machine. The guest must expose an ARM64 kernel/userspace; x86_64 emulation is not an accepted target.

## 1. AppImage payload inspection

Verify the AppImage contains:
- AppRun entry point
- CIN Main Lobby executable
- graphical first-run installer
- GTK4/PyGObject runtime dependencies and introspection typelibs
- Deploy engine and network controller modules
- desktop integration metadata and icon

## 2. Rootless graphical installation

On a clean supported ARM64 Linux desktop:
- Download the AArch64 AppImage.
- Enable executable permission in the file manager if required.
- Double-click it.
- Confirm the graphical welcome installer appears.
- Select Install for this user.
- Confirm installation under ~/Applications.
- Confirm desktop entry under ~/.local/share/applications.
- Confirm no root, sudo, administrator password, terminal, package manager, or system directory modification occurs.

Also test Run without installing.

## 3. Main Lobby

Open the installed desktop entry. Verify Main Lobby is the first application screen and Settings navigation works in both directions.

## 4. Debian package

- Verify dpkg-deb reports Architecture: arm64.
- Verify the package contains the AArch64 AppImage, desktop entry, and icon.
- Install on a disposable Debian/Ubuntu ARM64 system using the graphical package manager.
- Confirm administrator authorization is requested for the conventional system installation.
- Launch CIN and verify it runs as the logged-in user, not as root.
- Remove the package and verify package files are removed.

The .deb is not a rootless installation method. Rootless users must use the AppImage.

## 5. Deploy

Verify the Deploy engine is present. Component-level updates must remain unavailable until an AppImage-aware signed replacement updater, genuine publisher public key, and signed official manifest are provisioned and verified.

## 6. Network control

On supported systemd environments:
- Verify CIN's own process scope is the only scope affected.
- Toggle OFF and verify CIN network traffic is denied.
- Verify a separate process outside CIN retains network access.
- Toggle ON and verify CIN access returns.
- On unsupported systems, confirm the UI reports unavailable rather than claiming enforcement.

## 7. Uninstall and data preservation

Run ~/.local/bin/cin-uninstall. Verify the installed AppImage and desktop launcher are removed. Verify user data and publisher trust configuration are preserved.

## 8. Release decision

Do not publish until ARM64 source tests, AppImage payload inspection, graphical rootless installation, Main Lobby runtime, Debian package metadata, and package contents checks pass. Record hardware/VM, distribution release, kernel, glibc, desktop environment, and all test outcomes.
