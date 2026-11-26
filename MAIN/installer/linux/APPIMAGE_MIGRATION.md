# CIN Linux distribution — AppImage

## Distribution decision

The official Linux distribution format is AppImage, replacing the previous Debian archive proposal. The release target is one file per CPU architecture:

- `Core_Identification_Nodes-x86_64.AppImage`
- `Core_Identification_Nodes-aarch64.AppImage`

AppImage is a portable Linux application format. It does not use the distribution package manager, does not require root or sudo, and does not write to system directories.

## First-run experience

1. The user downloads the AppImage.
2. The user marks it executable once in the file manager (Properties → Permissions → Allow executing file as program; exact wording depends on the desktop).
3. A double-click opens the CIN graphical welcome/installer.
4. “Install for this user” copies the same self-contained AppImage to `~/Applications`, creates a desktop launcher under `~/.local/share/applications`, and creates a user uninstaller at `~/.local/bin/cin-uninstall`.
5. CIN starts in Main Lobby. “Run without installing” is also available.

No terminal, root, sudo, administrator password, apt, dpkg or system-wide registration is used by the user-facing installation flow.

## Runtime and distribution compatibility

AppImage supports many mainstream Linux distributions, but not literally every Linux environment. The release matrix targets x86_64 and AArch64 on glibc-based desktop distributions. Alpine/musl, very old glibc systems, non-desktop systems, and unsupported CPU architectures are outside the initial target. The minimum glibc baseline and GTK runtime closure must be validated in clean distribution containers before release.

The GTK4/PyGObject runtime, introspection typelibs, and dynamically loaded libraries must be included and verified in the AppImage. A successful AppImage file build alone is not proof of portability.

## CIN runtime components

The AppImage must include Main Lobby, Settings, Deploy engine, and the CIN network controller. Deploy must preserve the user's independent publisher trust key and records. The network switch may only report OFF when CIN's own process scope is actually denied network access; if the host lacks a usable systemd user manager or required cgroup support, the UI must report the control as unavailable rather than imply that the host or other applications are affected.

## Release gates

- Build separately on x86_64 and AArch64.
- Inspect the AppImage payload and confirm both GUI entry points and Deploy modules are present.
- Run the AppImage on clean Ubuntu, Debian, Fedora, and Linux Mint desktop environments for each supported architecture where runners are available.
- Verify first-run graphical installation, launch into Main Lobby, Settings navigation, uninstall, and preservation of user data.
- Verify the network policy on supported systemd environments and confirm unrelated host processes retain connectivity.
- Do not publish a release until GTK4 typelibs and native dependencies are resolved without relying on host-installed Python, PyGObject, or GTK packages.

## Important limitation

Some Linux file managers do not execute downloaded files until the user enables the executable permission. This is a desktop security policy, not an installer privilege requirement. CIN cannot bypass that policy without weakening the user's system security.
