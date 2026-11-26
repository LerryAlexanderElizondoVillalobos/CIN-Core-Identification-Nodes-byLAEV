# CIN Main — Linux Delivery Roadmap

## Milestone 1 — Portable Linux AppImage

Official user-facing format: AppImage.

Architecture-specific files:
- `Core_Identification_Nodes-x86_64.AppImage`
- `Core_Identification_Nodes-aarch64.AppImage`

The first launch opens a graphical installer. The user can install for the current account under `~/Applications` or run without installation. Desktop integration is written only under `~/.local/share/applications`. No root, sudo, administrator password, terminal, apt, dpkg, or system-wide file changes are required.

### M1.1 — Main Lobby and Settings
- Launch directly into Main Lobby.
- Open Settings from the Lobby and return with Back.
- Keep unavailable workflows clearly marked.

### M1.2 — Deploy engine
- Include the component-aware Deploy engine.
- Generate deterministic local component manifests and SHA-256 fingerprints.
- Verify official manifests against an independently provisioned Ed25519 publisher key.
- Require explicit operator authorization before applying changes.
- Keep remote deployment unavailable until genuine trust material and signed official manifests are published.

### M1.3 — CIN-scoped network switch
- Enforce OFF only through CIN's own process scope.
- Restore access on ON.
- Do not alter host networking, NetworkManager, or other applications.
- Report unsupported systemd/cgroup environments accurately.

### M1.4 — AppImage build and distribution
- Build x86_64 and AArch64 artifacts separately.
- Bundle Python, GTK4/PyGObject runtime dependencies, typelibs, and application modules.
- Provide a graphical first-run install/run choice.
- Install only under the current user's home directory.
- Preserve user data and publisher trust configuration on update and uninstall.

### M1.5 — Release qualification
- Run source tests and package inspection.
- Validate both architecture artifacts.
- Test clean mainstream Linux desktop environments.
- Verify first-run installation, Main Lobby, Settings, Deploy state, network behavior, and uninstall.
- Publish only after runtime portability is demonstrated.


## Milestone 1.6 — Debian 13 ARM64 user-space package for LinDesk

Target: Debian GNU/Linux 13 (Trixie), ARM64/AArch64, including compatible Debian-based Linux environments hosted on Android such as LinDesk.

Official payload: CIN.deb, Debian package core-identification-nodes, version 0.5.0, architecture arm64.

- Bundle the relocatable GTK4 Main Lobby runtime and the user-space installer, uninstaller, and temporary runner in the same .deb.
- Install without root, sudo, apt install, dpkg -i, system package database writes, or system-wide file changes.
- Extract the .deb with dpkg-deb -x, then execute /opt/cin-installer/install-user.sh from the temporary extraction as the normal user.
- Place the application under ~/.local/opt/cin-main-lobby/AppDir, launcher at ~/.local/bin/cin, and desktop entry/icon under XDG user directories.
- Preserve user data, configuration, and cache on upgrades and uninstall.
- Do not require systemd, a systemd user manager, cgroups, FUSE, or a resident daemon for installation and direct launch.
- Require a graphical GTK4 session to display the application; headless installation is supported.
- Qualify on a Debian 13 ARM64 CI runner, then perform physical LinDesk device testing before declaring device compatibility.

The optional CIN-Debian13-Installer.zip contains the same .deb and helper scripts. It is a convenience format, not a second installation architecture.


## Milestone 2 — Main Lobby foundation
- Establish private local storage.
- Load installation and lifecycle records.
- Reconstruct actual process state after restart.
- Present pre-birth and incomplete states accurately.

## Milestone 3 — Genesis Environment Certificate
- Implement environment collection and provenance labels.
- Build and validate the Genesis Environment Manifest.
- Register it as the first logical CIN record.

## Milestone 4 — CIN Node Birth Certificate
- Import the complete registered Genesis Manifest.
- Finalize the approved identifier derivation profile and conformance vectors.
- Integrate separate Node Birth Authorization.
- Commit and independently verify the Node Birth Record and applicable technical node identifiers.

## Milestone 5 — CIN Global Personal Document and Node Marriage
- Implement deterministic document identifier derivation.
- Integrate an external wallet/signer.
- Verify the signed association and persist both artifacts separately.

## Phase 2 — CIN Package Engine Installer
A separate installer for the engine of engines, following the founding node and node-document association prerequisites. It will manage specialized packages, engines, dependencies, configuration, permissions, signing connectors, and lifecycle.

## Release discipline
A successful build is not a successful runtime qualification. A release is not official until architecture-specific AppImages pass clean-environment tests and the operator verifies the intended desktop experience.
