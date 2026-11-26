# Core Identification Nodes — Linux AppImage

**Official Linux format:** AppImage  
**Build targets:** x86_64 and AArch64  
**Installation model:** graphical, per-user, no root and no sudo.

## First launch

1. Download the AppImage matching the computer's CPU architecture.
2. In the file manager, open Properties → Permissions and enable execution if the download is not already executable. Wording varies by desktop.
3. Double-click the AppImage.
4. Choose **Install for this user** or **Run without installing**.
5. The installer copies the self-contained AppImage to `~/Applications`, creates a desktop launcher in `~/.local/share/applications`, and launches CIN Main Lobby.

The user-facing flow does not use a terminal, root, sudo, dpkg, apt, or administrator authentication. No system directories are modified.

## Uninstall

Run the per-user uninstaller from the desktop user's application launcher or execute `~/.local/bin/cin-uninstall`. It removes the installed AppImage and desktop launcher while preserving CIN user data and configuration.

## Included application

The distribution includes Main Lobby, Settings, the Deploy engine, and the CIN network controller. The Deploy engine is included, but remote component updates are disabled in this AppImage build. Enabling them requires an AppImage-aware signed replacement updater as well as the genuine publisher public key and signed official manifest.

## Network switch

The network switch is application-scoped. It may report OFF only when the current Linux system actually enforces the CIN scope policy. Systems without the required systemd user manager/cgroup support must show the control as unavailable; CIN must not imply that host-wide network access was disabled.

## Portability

AppImage is intended for mainstream Linux distributions. CIN builds separate x86_64 and AArch64 artifacts. Alpine/musl, old glibc environments, unsupported architectures, and headless systems are not part of the initial release target. Each supported artifact must pass clean-environment runtime tests before publication.

The first release is not considered complete merely because the AppImage file was generated. GTK4/PyGObject libraries and introspection metadata must work from the bundled payload without requiring host-installed Python, PyGObject, or GTK.
