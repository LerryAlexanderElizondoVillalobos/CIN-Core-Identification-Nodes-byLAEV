# Core Identification Nodes — Linux AppImage

**Official Linux format:** AppImage  
**Build targets:** x86_64 and AArch64  
**Installation:** graphical, per-user, no root and no sudo.

## Included capabilities

- CIN Main Lobby, opening as the initial screen.
- Settings with Lobby navigation.
- Component-aware Deploy engine, with remote deployment gated on publisher trust and AppImage update integration.
- CIN-only network ON/OFF controller, enforced only where the user's systemd scope and cgroup policy are supported.
- Graphical first-run installer and portable run option.
- Per-user installation under `~/Applications` with desktop integration under `~/.local/share/applications`.

## Official artifacts

- `Core_Identification_Nodes-x86_64.AppImage`
- `Core_Identification_Nodes-aarch64.AppImage`

The GitHub Actions workflow builds one artifact for each supported architecture. AppImage targets mainstream glibc-based Linux desktop distributions, not every Linux environment (for example, Alpine/musl and unsupported architectures are outside the initial target).

## Installation

1. Download the artifact matching the computer's architecture.
2. If required by the desktop environment, open Properties → Permissions and enable execution.
3. Double-click the AppImage.
4. Choose **Install for this user** or **Run without installing**.

The graphical installer copies the AppImage to `~/Applications`, creates the desktop entry, and starts CIN Main Lobby. The user-facing process does not invoke a terminal, root, sudo, apt, dpkg, or administrator authentication. It does not modify system directories.

Uninstall with `~/.local/bin/cin-uninstall`. User data and configuration are preserved.

## Deploy

The Deploy engine is included in the application. The Deploy engine is included, but component-level updates remain disabled until an AppImage-aware signed replacement updater, the genuine publisher Ed25519 public key, and the signed official manifest are provisioned and verified. The engine must not apply component changes to an immutable mounted AppImage.

## Network switch

The ON/OFF control is limited to CIN's own systemd user scope. OFF must be confirmed by the actual system policy. Other applications and host networking remain unaffected. If the required user manager or cgroup support is unavailable, CIN reports the control as unavailable rather than claiming isolation.

## Release validation

An artifact is not an official release merely because packaging completed. The AppImage must pass:
1. Source tests and syntax checks.
2. x86_64 and AArch64 build and payload inspection.
3. Clean-environment GTK4/PyGObject runtime validation without host-installed Python or GTK.
4. Graphical first-run installation and Main Lobby launch.
5. Settings navigation and supported network-scope OFF/ON tests.
6. Uninstallation and user-data preservation.

See [Linux AppImage migration](installer/linux/APPIMAGE_MIGRATION.md) and the [acceptance test plan](installer/linux/INSTALLATION_TEST_PLAN.md).
